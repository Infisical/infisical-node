// development test file only
require('dotenv').config();
const InfisicalClient = require("./lib");

const config = {
  token: process.env.INFISICAL_TOKEN,
};

async function fetchData() {
  try {
    const client = new InfisicalClient(config);

    // create nested secrets that all resolve to the deeply nested value
    await client.createSecret("NESTED_SECRET_1", "${NESTED_SECRET_2}");
    await client.createSecret("NESTED_SECRET_2", "${NESTED_SECRET_3}");
    await client.createSecret("NESTED_SECRET_3", "DEEPLY_NESTED_SECRET");

    // create secrets that are part of a nested secret
    await client.createSecret("PROTOCOL", "https");
    await client.createSecret("DOMAIN", "www.infisical.com");
    await client.createSecret("FULL_HOST", "${PROTOCOL}://${DOMAIN}");

    // fetch all of the nested secrets
    const secrets = await client.getAllSecrets({ environment: "dev", path: "/", attachToProcessEnv: false, includeImports: true });

    // eslint-disable-next-line no-console
    console.log("secrets:", secrets);

    // check the return values are what we expect
    const expectedValues = [
        'DEEPLY_NESTED_SECRET',
        'https',
        'www.infisical.com',
        'https://www.infisical.com'
    ];

    let allTestsPass = true;

    for (const expectedValue of expectedValues) {
        const count = secrets.filter(secret => secret.secretValue === expectedValue).length;
        if (expectedValue === 'DEEPLY_NESTED_SECRET') {
            if (count !== 3) {
                allTestsPass = false;
                console.log(`Test failed for ${expectedValue}. Expected count: 3, Actual count: ${count}`);
            }
        } else {
            if (count !== 1) {
                allTestsPass = false;
                console.log(`Test failed for ${expectedValue}. Expected count: 1, Actual count: ${count}`);
            }
        }
    }

    if (allTestsPass) {
        console.log("All tests pass!");
    } else {
        console.log("Some tests failed.");
    }

    // cleanup all of the created secrets
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