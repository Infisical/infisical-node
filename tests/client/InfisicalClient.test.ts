require('dotenv').config();
import * as clientHelper from '../../src/helpers/client';
import { describe, expect } from '@jest/globals';
import crypto from 'crypto';
import InfisicalClient from '../../src';


describe('InfisicalClient', () => {
    let client: InfisicalClient;
    beforeAll(async () => {
        client = new InfisicalClient({
            token: process.env.INFISICAL_TOKEN!,
            siteURL: process.env.SITE_URL!,
            debug: true
        });

        await client.createSecret('KEY_ONE', 'KEY_ONE_VAL');
        await client.createSecret('KEY_ONE', 'KEY_ONE_VAL_PERSONAL', {
            type: 'personal'
        });
        await client.createSecret('KEY_TWO', 'KEY_TWO_VAL');
    });

    afterAll(async () => {
        await client.deleteSecret('KEY_ONE');
        await client.deleteSecret('KEY_TWO');
        await client.deleteSecret('KEY_THREE');
    });

    it('get overriden personal secret', async () => {
        const secret = await client.getSecret('KEY_ONE');

        expect(secret.secretName).toBe('KEY_ONE');
        expect(secret.secretValue).toBe('KEY_ONE_VAL_PERSONAL');
        expect(secret.type).toBe('personal');
    });

    it('get shared secret specified', async () => {
        const secret = await client.getSecret('KEY_ONE', {
            type: 'shared'
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
        const secret = await client.createSecret('KEY_FOUR', 'KEY_FOUR_VAL');
        const secretPersonal = await client.createSecret('KEY_FOUR', 'KEY_FOUR_VAL_PERSONAL', {
            type: 'personal'
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
            type: 'personal'
        });

        expect(secret.secretName).toBe('KEY_FOUR');
        expect(secret.secretValue).toBe('BAR');
        expect(secret.type).toBe('personal');
    });

    it('delete personal secret', async () => {
        const secret = await client.deleteSecret('KEY_FOUR', {
            type: 'personal'
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

    describe('Method: loadSecretsToEnv', () => {
        const originalProcessEnv = process.env;
        beforeAll(() => {
            jest.spyOn(client, 'getAllSecrets').mockResolvedValue([{
                secretName: 'SECRET1',
                secretValue: 'SECRET1 PERSONAL',
                type: 'personal',
                isFallback: false,
                lastFetchedAt: new Date(),
            },
            {
                secretName: 'SECRET2',
                secretValue: 'SECRET2 SHARED',
                type: 'shared',
                isFallback: false,
                lastFetchedAt: new Date(),
            },
            {
                secretName: 'SECRET3',
                secretValue: 'SECRET VALUE 3',
                type: 'personal',
                isFallback: false,
                lastFetchedAt: new Date(),
            }]);
        })

        beforeEach(() => {
            process.env = {}
        })

        afterAll(() => {
            process.env = {
                ...originalProcessEnv,
            };

            jest.restoreAllMocks();
        })

        it('should load correct secrets', async () => {
            await client.loadSecretsToEnv({
                shouldOverride: false,
            });

            expect(process.env).toStrictEqual({
                "SECRET1": "SECRET1 PERSONAL",
                "SECRET2": "SECRET2 SHARED",
                "SECRET3": "SECRET VALUE 3",
            });
        })

        it('should not override existing process.env variable when shouldOverride is false', async () => {
            process.env = {
                SECRET1: 'ORIGINAL SECRET 1',
                SECRET2: 'ORIGINAL SECRET 2',
                SECRET3: 'ORIGINAL SECRET 3',
            }

            await client.loadSecretsToEnv({
                shouldOverride: false,
            })

            expect(process.env).toStrictEqual({
                "SECRET1": "ORIGINAL SECRET 1",
                "SECRET2": "ORIGINAL SECRET 2",
                "SECRET3": "ORIGINAL SECRET 3",
            })
        })

        it('should override existing process.env variable when shouldOverride is true', async () => {
            process.env = {
                SECRET1: 'ORIGINAL SECRET 1',
                SECRET2: 'ORIGINAL SECRET 2',
                SECRET3: 'ORIGINAL SECRET 3',
            }

            await client.loadSecretsToEnv({
                shouldOverride: true,
            })

            expect(process.env).toStrictEqual({
                "SECRET1": "SECRET1 PERSONAL",
                "SECRET2": "SECRET2 SHARED",
                "SECRET3": "SECRET VALUE 3",
            })
        })
    })
});
