// development test file only

require('dotenv').config();
import InfisicalClient from "./lib";

const config = {
  token: process.env.INFISICAL_TOKEN,
};

async function fetchData() {
  try {
    const client = new InfisicalClient(config);

    const secrets = await client.getAllSecrets({
      environment: "dev",
      path: "/",
      attachToProcessEnv: false,
      includeImports: true,
    });

    console.log("secrets:", secrets);

    // const secret = await client.getSecret("FULL_HOST", {
    //   environment: "dev",
    //   path: "/",
    //   type: "shared",
    // });

    // // console.log("secret:", secret);

  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

fetchData();