import { createLaunch } from "./createLaunch";
import { depositLaunch } from "./depositLaunch";
import { perform } from "./perform";

async function main() {
    // 1. create launch
    const { launchedToken, pair } = await createLaunch("TEST", "TEST");
    console.log("launchedToken: ", launchedToken);
    console.log("pair: ", pair);

    // 2. deposit launch
    await depositLaunch(launchedToken, "20000");

    // 3. perform
    const { ichivault } = await perform(pair);
    console.log("ichivault: ", ichivault);

    // 4. withdraw LP from ichivault


    // 5. deposit launchToken to ichivault
}

main();
