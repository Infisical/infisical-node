// this is a development test file only!!!
// please first create a folder called "db-secrets" in the "dev" environment to run these tests
require('dotenv').config();
const InfisicalClient = require("./lib");

function generateRandomSecretName() {
    const getRandomString = (len) => {
        let res = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // infisical-scan:ignore
        for (let i = 0; i < len; i++) {
            const randIdx = Math.floor(Math.random() * chars.length);
            res += chars.charAt(randIdx);
        }
        return res;
    };
    const randStr1 = getRandomString(Math.floor(Math.random() * (10 - 5 + 1)) + 5);
    const randStr2 = getRandomString(Math.floor(Math.random() * (10 - 5 + 1)) + 5);
    return `${randStr1}_${randStr2}`;
}

function generateRandomSecretValue() {
    const len = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
    let res = '';
    // NB. any char can be added to this string (eg. emojis, non-Latin languages) (except for escape chars) 
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@#$%^&*()-_=+[{]};:\'"<,>.?/|'; // infisical-scan:ignore
    for (let i = 0; i < len; i++) {
        const randIdx = Math.floor(Math.random() * chars.length);
        res += chars.charAt(randIdx);
    }
    return res;
}

async function fetchData() {
  try {
    const client = new InfisicalClient({
      token: process.env.INFISICAL_TOKEN
    });

    console.log("Running tests...")

    // create secrets that reference each other and resolve to the same value
    await client.createSecret("SECRET_REF_1", "${SECRET_REF_2}");
    await client.createSecret("SECRET_REF_2", "${SECRET_REF_3}");
    await client.createSecret("SECRET_REF_3", "DEEPLY_NESTED_SECRET");

    // create secrets that concatenate to form another secret in the same directory
    await client.createSecret("PROTOCOL", "https");
    await client.createSecret("HOSTNAME", "www.infisical.com");
    await client.createSecret("FULL_HOST", "${PROTOCOL}://${HOSTNAME}");

    // create secrets that concatenate to form another secret across environments
    await client.createSecret("USERNAME", "admin2023", { type: "shared", environment: "dev", path: "/db-secrets" });
    await client.createSecret("PASSWORD", "Supersecret123", { type: "shared", environment: "dev", path: "/db-secrets" });
    await client.createSecret("PORT", "4000", { type: "shared", environment: "dev", path: "/db-secrets" });
    await client.createSecret("DB_NAME", "dev", { type: "shared", environment: "dev", path: "/db-secrets" });
    await client.createSecret("MONGO_URL", "mongodb://${dev.db-secrets.USERNAME}:${dev.db-secrets.PASSWORD}@${HOSTNAME}:${dev.db-secrets.PORT}/${dev.db-secrets.DB_NAME}");

    // create random secret names that reference each other and resolve to a random value
    const RANDOM_SECRET_NAME = generateRandomSecretName();
    const RANDOM_SECRET_VALUE = generateRandomSecretValue();

    const RANDOM_SECRET_NAME_1 = `${RANDOM_SECRET_NAME}_1`;
    const RANDOM_SECRET_NAME_2 = `${RANDOM_SECRET_NAME}_2`;
    const RANDOM_SECRET_NAME_3 = `${RANDOM_SECRET_NAME}_3`;

    const reference1 = `${"${" + RANDOM_SECRET_NAME_2 + "}"}`;
    const reference2 = `${"${" + RANDOM_SECRET_NAME_3 + "}"}`;

    await client.createSecret(RANDOM_SECRET_NAME_1, reference1);
    await client.createSecret(RANDOM_SECRET_NAME_2, reference2);
    await client.createSecret(RANDOM_SECRET_NAME_3, RANDOM_SECRET_VALUE);

    // fetch each secret reference individually  
    const secretReferences = ['SECRET_REF_1', 'SECRET_REF_2', 'SECRET_REF_3', 'FULL_HOST', 'MONGO_URL', RANDOM_SECRET_NAME_1, RANDOM_SECRET_NAME_2, RANDOM_SECRET_NAME_3];

    const getSecretArray = [];
    for (const ref of secretReferences) {
        getSecretArray.push(await client.getSecret(ref));
    }

    const expectedGetSecretValues = [
        'DEEPLY_NESTED_SECRET',
        'https://www.infisical.com',
        'mongodb://admin2023:Supersecret123@www.infisical.com:4000/dev',
        RANDOM_SECRET_VALUE,
    ];

    // run tests for getSecret
    let getSecretTestsPass = true;
    for (const ev of expectedGetSecretValues) {
        const count = getSecretArray.filter(s => s.secretValue === ev).length;
        if (ev === 'DEEPLY_NESTED_SECRET') {
            if (count !== 3) {
                getSecretTestsPass = false;
                console.log(`Test failed for ${ev}. Expected count: 3, Actual count: ${count}`);
            }
        } else if (ev === 'https://www.infisical.com') {
            if (count !== 1) {
                getSecretTestsPass = false;
                console.log(`Test failed for ${ev}. Expected count: 1, Actual count: ${count}`);
            }
        } else if (ev === 'mongodb://admin2023:Supersecret123@www.infisical.com:4000/dev') {
            if (count !== 1) {
                getSecretTestsPass = false;
                console.log(`Test failed for ${ev}. Expected count: 1, Actual count: ${count}`);
            }
        } else if (ev === RANDOM_SECRET_VALUE) {
            if (count !== 3) {
                getSecretTestsPass = false;
                console.log(`Test failed for ${ev}. Expected count: 3, Actual count: ${count}`);
            }
        }
    }

    if (getSecretTestsPass) {
        console.log("getSecret tests passed!");
    } else {
        console.log("Some of the getSecret tests failed.");
    }

    // fetch all shared secrets in the dev directory only
    const getAllSecretsArray = await client.getAllSecrets();

    const expectedGetAllSecretsValues = [
        'DEEPLY_NESTED_SECRET',
        'https',
        'www.infisical.com',
        'https://www.infisical.com',
        'mongodb://admin2023:Supersecret123@www.infisical.com:4000/dev',
        RANDOM_SECRET_VALUE
    ];

    // run tests for getAllSecrets
    let getAllSecretsTestsPass = true;
    for (const ev of expectedGetAllSecretsValues) {
        const count = getAllSecretsArray.filter(s => s.secretValue === ev).length;
        if (ev === 'DEEPLY_NESTED_SECRET') {
            if (count !== 3) {
                getAllSecretsTestsPass = false;
                console.log(`Test failed for ${ev}. Expected count: 3, Actual count: ${count}`);
            }
        } else if (ev === RANDOM_SECRET_VALUE) {
            if (count !== 3) {
                getAllSecretsTestsPass = false;
                console.log(`Test failed for ${ev}. Expected count: 3, Actual count: ${count}`);
            }
        } else {
            if (count !== 1) {
                getAllSecretsTestsPass = false;
                console.log(`Test failed for ${ev}. Expected count: 1, Actual count: ${count}`);
            }
        }
    }

    if (getAllSecretsTestsPass) {
        console.log("All getAllSecrets tests passed!");
    } else {
        console.log("Some of the getAllSecrets tests failed.");
    }

    if (getSecretTestsPass && getAllSecretsTestsPass) {
        console.log("All tests passed!");
    } else {
        console.log("Some of the tests failed.");
    }

    // cleanup all of the secrets
    await client.deleteSecret('SECRET_REF_1');
    await client.deleteSecret('SECRET_REF_2');
    await client.deleteSecret('SECRET_REF_3');
    await client.deleteSecret('PROTOCOL');
    await client.deleteSecret('HOSTNAME');
    await client.deleteSecret('FULL_HOST');
    await client.deleteSecret('MONGO_URL');
    await client.deleteSecret(RANDOM_SECRET_NAME_1);
    await client.deleteSecret(RANDOM_SECRET_NAME_2);
    await client.deleteSecret(RANDOM_SECRET_NAME_3);
    await client.deleteSecret("USERNAME", { type: "shared", environment: "dev", path: "/db-secrets" });
    await client.deleteSecret("PASSWORD", { type: "shared", environment: "dev", path: "/db-secrets" });
    await client.deleteSecret("PORT", { type: "shared", environment: "dev", path: "/db-secrets" });
    await client.deleteSecret("DB_NAME", { type: "shared", environment: "dev", path: "/db-secrets" });
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

fetchData();