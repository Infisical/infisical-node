require('dotenv').config();
import { afterAll, beforeAll, describe, expect } from '@jest/globals';
import InfisicalClient from '../../src';

// please first create a folder called "db-secrets" in the "dev" environment to run these tests

describe('InfisicalClient', () => {
    let client: InfisicalClient;
    beforeAll(async () => {
        client = new InfisicalClient({
            token: process.env.INFISICAL_TOKEN!,
            tokenJson: process.env.INFISICAL_TOKEN_JSON!,
            siteURL: process.env.SITE_URL!,
            debug: true
        });
        await client.createSecret('KEY_ONE', 'KEY_ONE_VAL');
        await client.createSecret('KEY_ONE', 'KEY_ONE_VAL_PERSONAL', {
            type: "personal",
            environment: "dev",
            path: "/"
        });
        await client.createSecret('KEY_TWO', 'KEY_TWO_VAL');

        await client.createSecret("SECRET_REF_1", "${SECRET_REF_2}");
        await client.createSecret("SECRET_REF_2", "${SECRET_REF_3}");
        await client.createSecret("SECRET_REF_3", "DEEPLY_NESTED_SECRET");

        await client.createSecret("PROTOCOL", "https");
        await client.createSecret("HOSTNAME", "www.infisical.com");
        await client.createSecret("FULL_HOST", "${PROTOCOL}://${HOSTNAME}");

        await client.createSecret("USERNAME", "admin2023", {
            type: "shared",
            environment: "dev",
            path: "/db-secrets"
        });
        await client.createSecret("PASSWORD", "Supersecret123", {
            type: "shared",
            environment: "dev",
            path: "/db-secrets"
        });
        await client.createSecret("PORT", "4000", {
            type: "shared",
            environment: "dev",
            path: "/db-secrets"
        });
        await client.createSecret("DB_NAME", "dev", {
            type: "shared",
            environment: "dev",
            path: "/db-secrets"
        });
        await client.createSecret("MONGO_URL", "mongodb://${dev.db-secrets.USERNAME}:${dev.db-secrets.PASSWORD}@${HOSTNAME}:${dev.db-secrets.PORT}/${dev.db-secrets.DB_NAME}");
    }, 30000);

    afterAll(async () => {
        await client.deleteSecret('KEY_ONE');
        await client.deleteSecret('KEY_ONE', {
            type: "personal",
            environment: "dev",
            path: "/"
        });
        await client.deleteSecret('KEY_TWO');
        await client.deleteSecret('KEY_THREE');
        await client.deleteSecret('SECRET_REF_1');
        await client.deleteSecret('SECRET_REF_2');
        await client.deleteSecret('SECRET_REF_3');
        await client.deleteSecret('PROTOCOL');
        await client.deleteSecret('HOSTNAME');
        await client.deleteSecret('FULL_HOST');
        await client.deleteSecret('USERNAME', {
            type: "shared",
            environment: "dev",
            path: "/db-secrets",
        });
        await client.deleteSecret('PASSWORD', {
            type: "shared",
            environment: "dev",
            path: "/db-secrets",
        });
        await client.deleteSecret('PORT', {
            type: "shared",
            environment: "dev",
            path: "/db-secrets",
        });
        await client.deleteSecret('DB_NAME', {
            type: "shared",
            environment: "dev",
            path: "/db-secrets",
        });
        await client.deleteSecret('MONGO_URL');
    }, 30000);

    it('get overriden personal secret', async () => {
        const secret = await client.getSecret('KEY_ONE', {
            type: "personal",
            environment: "dev",
            path: "/"
        });

        expect(secret.secretName).toBe('KEY_ONE');
        expect(secret.secretValue).toBe('KEY_ONE_VAL_PERSONAL');
        expect(secret.type).toBe('personal');
    });

    it('get shared secret specified', async () => {
        const secret = await client.getSecret('KEY_ONE', {
            type: 'shared',
            environment: "dev",
            path: "/"
        });

        expect(secret.secretName).toBe('KEY_ONE');
        expect(secret.secretValue).toBe('KEY_ONE_VAL');
        expect(secret.type).toBe('shared');
    });

    it('get shared secret', async () => {
        const secret = await client.getSecret('KEY_TWO');

        expect(secret.secretName).toBe('KEY_TWO');
        expect(secret.secretValue).toBe('KEY_TWO_VAL');
        expect(secret.type).toBe('shared');
    });

    it('create shared secret', async () => {
        const secret = await client.createSecret('KEY_THREE', 'KEY_THREE_VAL');

        expect(secret.secretName).toBe('KEY_THREE');
        expect(secret.secretValue).toBe('KEY_THREE_VAL');
        expect(secret.type).toBe('shared');
    });

    it('create personal secret', async () => {
        await client.createSecret('KEY_FOUR', 'KEY_FOUR_VAL');
        const secretPersonal = await client.createSecret('KEY_FOUR', 'KEY_FOUR_VAL_PERSONAL', {
            type: "personal",
            environment: "dev",
            path: "/"
        });

        expect(secretPersonal.secretName).toBe('KEY_FOUR');
        expect(secretPersonal.secretValue).toBe('KEY_FOUR_VAL_PERSONAL');
        expect(secretPersonal.type).toBe('personal');
    });

    it('update shared secret', async () => {
        const secret = await client.updateSecret('KEY_THREE', 'FOO');

        expect(secret.secretName).toBe('KEY_THREE');
        expect(secret.secretValue).toBe('FOO');
        expect(secret.type).toBe('shared');
    });

    it('update personal secret', async () => {
        const secret = await client.updateSecret('KEY_FOUR', 'BAR', {
            type: "personal",
            environment: "dev",
            path: "/"
        });

        expect(secret.secretName).toBe('KEY_FOUR');
        expect(secret.secretValue).toBe('BAR');
        expect(secret.type).toBe('personal');
    });

    it('delete personal secret', async () => {
        const secret = await client.deleteSecret('KEY_FOUR', {
            type: "personal",
            environment: "dev",
            path: "/"
        });

        expect(secret.secretName).toBe('KEY_FOUR');
        expect(secret.secretValue).toBe('BAR');
        expect(secret.type).toBe('personal');
    });

    it('delete shared secret', async () => {
        const secret = await client.deleteSecret('KEY_FOUR');

        expect(secret.secretName).toBe('KEY_FOUR');
        expect(secret.secretValue).toBe('KEY_FOUR_VAL');
        expect(secret.type).toBe('shared');
    });

    it('get shared secret - secret reference', async () => {
        const secret = await client.getSecret('FULL_HOST');

        expect(secret.secretName).toBe('FULL_HOST');
        expect(secret.secretValue).toBe('https://www.infisical.com');
    });

    it('get all secrets - secret references', async () => {
        const secrets = await client.getAllSecrets();

        const expectedValues = [
            'DEEPLY_NESTED_SECRET',
            'https',
            'www.infisical.com',
            'https://www.infisical.com',
            'mongodb://admin2023:Supersecret123@www.infisical.com:4000/dev'
        ];

        for (const expectedValue of expectedValues) {
            const count = secrets.filter(secret => secret.secretValue === expectedValue).length;
            if (expectedValue === 'DEEPLY_NESTED_SECRET') {
                expect(count).toBe(3);
            } else {
                expect(count).toBe(1);
            }
        }
    });

    it('attach all to process.env', async () => {
        // note: getAllSecrets returns dupliate shared + personal ones at the moment,
        // should it default to personal?
        // const secretBundles = await client.getAllSecrets({
        //     environment: "dev",
        //     path: "/",
        //     attachToProcessEnv: true,
        //     includeImports: false
        // });

        // can't test this because both key are same, only type is diff 
        // secretBundles.forEach((secretBundle) => {
        //     expect(process.env[secretBundle.secretName]).toBe(secretBundle.secretValue);
        // });
    });

    it('encrypt/decrypt symmetric', () => {
        const plaintext = 'The quick brown fox jumps over the lazy dog';

        const key = client.createSymmetricKey();

        const {
            ciphertext,
            iv,
            tag
        } = client.encryptSymmetric(plaintext, key);

        const cleartext = client.decryptSymmetric(
            ciphertext,
            key,
            iv,
            tag
        );

        expect(plaintext).toBe(cleartext);
    });
});