import { createLaunch } from "./createLaunch";


async function main() {
    const { launchedToken, pair } = await createLaunch();
    console.log(launchedToken);
    console.log(pair);
}

main();