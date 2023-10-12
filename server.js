// this is a development test file only
require('dotenv').config();
const InfisicalClient = require("./lib");

async function fetchData() {
  try {
    const client = new InfisicalClient({
      token: process.env.INFISICAL_TOKEN
    });

    await client.createSecret("NESTED_SECRET_1", "${NESTED_SECRET_2}");
    await client.createSecret("NESTED_SECRET_2", "${NESTED_SECRET_3}");
    await client.createSecret("NESTED_SECRET_3", "DEEPLY_NESTED_SECRET");

    await client.createSecret("PROTOCOL", "https");
    await client.createSecret("DOMAIN", "www.infisical.com");
    await client.createSecret("FULL_HOST", "${PROTOCOL}://${DOMAIN}");

    const secret1 = await client.getSecret('NESTED_SECRET_1');
    const secret2 = await client.getSecret('NESTED_SECRET_2');
    const secret3 = await client.getSecret('NESTED_SECRET_3');
    const secret4 = await client.getSecret('PROTOCOL');
    const secret5 = await client.getSecret('DOMAIN');
    const secret6 = await client.getSecret('FULL_HOST');
    
    const getSecretArray = [secret1, secret2, secret3];

    // eslint-disable-next-line no-console
    console.log("secret1:", secret1);
    // eslint-disable-next-line no-console
    console.log("secret2:", secret2);
    // eslint-disable-next-line no-console
    console.log("secret3:", secret3);
    // eslint-disable-next-line no-console
    console.log("secret4:", secret4);
    // eslint-disable-next-line no-console
    console.log("secret5:", secret5);
    // eslint-disable-next-line no-console
    console.log("secret6:", secret6);

    const expectedGetSecretValues = [
        'DEEPLY_NESTED_SECRET',
        'https://www.infisical.com'
    ];

    let getSecretTestsPass = true;
    for (const ev of expectedGetSecretValues) {
        const count = getSecretArray.filter(s => s.secretValue === ev).length;
        if (ev === 'DEEPLY_NESTED_SECRET') {
            if (count !== 3) {
                getSecretTestsPass = false;
                console.log(`Test failed for ${ev}. Expected count: 3, Actual count: ${count}`);
            }
        } else if (ev === 'https') {
            if (count !== 1) {
                getSecretTestsPass = false;
                console.log(`Test failed for ${ev}. Expected count: 1, Actual count: ${count}`);
            }
        } else if (ev === 'www.infisical.com') {
            if (count !== 1) {
                getSecretTestsPass = false;
                console.log(`Test failed for ${ev}. Expected count: 1, Actual count: ${count}`);
            }
        } else if (ev === 'https://www.infisical.com') {
            if (count !== 1) {
                getSecretTestsPass = false;
                console.log(`Test failed for ${ev}. Expected count: 1, Actual count: ${count}`);
            }
        }
    }

    if (getSecretTestsPass) {
        console.log("getSecret tests passed!");
    } else {
        console.log("Some of the getSecret tests failed.");
    }

    const getAllSecretsArray = await client.getAllSecrets();

    // eslint-disable-next-line no-console
    console.log("getAllSecretsArray:", getAllSecretsArray);

    const expectedGetAllSecretsValues = [
        'DEEPLY_NESTED_SECRET',
        'https',
        'www.infisical.com',
        'https://www.infisical.com'
    ];

    let getAllSecretsTestsPass = true;
    for (const ev of expectedGetAllSecretsValues) {
        const count = getAllSecretsArray.filter(s => s.secretValue === ev).length;
        if (ev === 'DEEPLY_NESTED_SECRET') {
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

    await client.deleteSecret('NESTED_SECRET_1');
    await client.deleteSecret('NESTED_SECRET_2');
    await client.deleteSecret('NESTED_SECRET_3');
    await client.deleteSecret('PROTOCOL');
    await client.deleteSecret('DOMAIN');
    await client.deleteSecret('FULL_HOST');

  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

fetchData();