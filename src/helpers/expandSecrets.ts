import path from "path";

import { decryptSymmetric128BitHexKeyUTF8 } from "../utils/crypto";
import { getSecrets } from "../api";
import { AxiosInstance } from "../types/api";

interface FetchSecretsCrossEnvParams {
    apiRequest: AxiosInstance;
    workspaceId: string;
    environment: string;
    workspaceKey: string;
    secretPath: string;
    includeImports: boolean;
}

const fetchSecretsCrossEnv = ({
    apiRequest,
    workspaceId,
    environment,
    workspaceKey,
    secretPath,
    includeImports,
}: FetchSecretsCrossEnvParams) => {

  const fetchCache: Record<string, Record<string, string>> = {};

  return async (secRefEnv: string, secRefPath: string[], secRefKey: string) => {
    const secRefPathUrl = path.posix.join('/', ...secRefPath); // ensure compatability for Windows
    const uniqKey = `${secRefEnv}-${secRefPathUrl}`;

    if (fetchCache?.[uniqKey]) {
      console.log("Returning cached value")
      return fetchCache[uniqKey][secRefKey];
    }

    const { secrets } = await getSecrets(apiRequest, {
        workspaceId,
        environment,
        path: secRefPathUrl,
        includeImports
    });

    const decryptedSec = secrets.reduce<Record<string, string>>((prev, secret) => {
      const secretKey = decryptSymmetric128BitHexKeyUTF8({
        ciphertext: secret.secretKeyCiphertext,
        iv: secret.secretKeyIV,
        tag: secret.secretKeyTag,
        key: workspaceKey
      });
      const secretValue = decryptSymmetric128BitHexKeyUTF8({
        ciphertext: secret.secretValueCiphertext,
        iv: secret.secretValueIV,
        tag: secret.secretValueTag,
        key: workspaceKey
      });

      prev[secretKey] = secretValue;
      return prev;
    }, {});

    fetchCache[uniqKey] = decryptedSec;

    return fetchCache[uniqKey][secRefKey];
  };
};

const INTERPOLATION_SYNTAX_REG = new RegExp(/\${([^}]+)}/g);

const recursivelyExpandSecret = async (
  expandedSec: Record<string, string>,
  interpolatedSec: Record<string, string>,
  fetchCrossEnv: (secRefEnv: string, secRefPath: string[], secRefKey: string) => Promise<string>,
  recursionChainBreaker: Record<string, boolean>,
  key: string
) => {
  if (expandedSec?.[key]) return expandedSec[key];
  if (recursionChainBreaker?.[key]) return "";

  recursionChainBreaker[key] = true;
  let interpolatedValue = interpolatedSec[key];

  if (!interpolatedValue) {
    // eslint-disable-next-line no-console
    console.error(`Couldn't find referenced value - ${key}`);
    return "";
  }

  const refs = interpolatedValue.match(INTERPOLATION_SYNTAX_REG);

  if (refs) {
    const resolvedValues = [];
    for (const interpolationSyntax of refs) {
      const interpolationKey = interpolationSyntax.slice(2, interpolationSyntax.length - 1);
      const entities = interpolationKey.trim().split(".");

      if (entities.length === 1) {
        const val = await recursivelyExpandSecret(
          expandedSec,
          interpolatedSec,
          fetchCrossEnv,
          recursionChainBreaker,
          interpolationKey
        );
        if (val) resolvedValues.push({ interpolationSyntax, val });
        continue;
      }

      if (entities.length > 1) {
        const secRefEnv = entities[0];
        const secRefPath = entities.slice(1, entities.length - 1);
        const secRefKey = entities[entities.length - 1];

        const val = await fetchCrossEnv(secRefEnv, secRefPath, secRefKey);
        if (val) resolvedValues.push({ interpolationSyntax, val });
      }
    }

    resolvedValues.forEach(({ interpolationSyntax, val }) => {
      const regex = new RegExp(interpolationSyntax.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      interpolatedValue = interpolatedValue.replace(regex, val);
    });
  }

  expandedSec[key] = interpolatedValue;
  return interpolatedValue;
};

// used to convert multi line ones to quotes ones with \n
const formatMultiValueEnv = (val?: string) => {
  if (!val) return "";
  if (!val.match("\n")) return val;
  return `"${val.replace(/\n/g, "\\n")}"`;
};

export const expandSecrets = async (
  workspaceId: string,
  workspaceKey: string,
  apiRequest: AxiosInstance,
  environment: string,
  secretPath: string,
  secrets: Record<string, { value: string; comment?: string; skipMultilineEncoding?: boolean }>,
  includeImports?: boolean
) => {

  const expandedSec: Record<string, string> = {};
  const interpolatedSec: Record<string, string> = {};

  const crossSecEnvFetch = fetchSecretsCrossEnv({
    workspaceId,
    workspaceKey, 
    apiRequest, 
    environment, 
    secretPath, 
    includeImports: includeImports ? includeImports : false
  });

  Object.keys(secrets).forEach((key) => {
    if (secrets[key].value.match(INTERPOLATION_SYNTAX_REG)) {
      interpolatedSec[key] = secrets[key].value;
    } else {
      expandedSec[key] = secrets[key].value;
    }
  });

  for (const key of Object.keys(secrets)) {
    if (expandedSec?.[key]) {
      // should not do multi line encoding if user has set it to skip
      secrets[key].value = secrets[key].skipMultilineEncoding
        ? expandedSec[key]
        : formatMultiValueEnv(expandedSec[key]);
      continue;
    }

    // this is to avoid recursion loop. So the graph should be direct graph rather than cyclic
    // so for any recursion building if there is an entity two times same key meaning it will be looped
    const recursionChainBreaker: Record<string, boolean> = {};
    const expandedVal = await recursivelyExpandSecret(
      expandedSec,
      interpolatedSec,
      crossSecEnvFetch,
      recursionChainBreaker,
      key
    );

    secrets[key].value = secrets[key].skipMultilineEncoding
      ? expandedVal
      : formatMultiValueEnv(expandedVal);
  }

  return secrets;
};