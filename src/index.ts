import { createLaunch } from "./functions/createLaunch";
import { depositLaunch } from "./functions/depositLaunch";
import { perform } from "./functions/perform";
import { Pot2PumpUtils } from "./utils/pot2pumpUtils";
import { ethers } from "ethers";
import { RAISED_TOKEN } from "./constants/constants";

import dotenv from 'dotenv';
import { claimLP } from "./functions/claimLP";
import { LaunchState } from "./enum/LaunchState";
import { withdrawableIChivaultLP, withdrawIChivaultLP } from "./functions/withdrawIChivaultLP";
import { depositIChivault } from "./functions/depositIChivault";
dotenv.config();

async function main() {
    // init provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
    const pot2pumpUtils = new Pot2PumpUtils(provider);

    // 1. create launch
    const { launchedToken, pair } = await createLaunch("TEST", "TEST");
    console.log("launchedToken: ", launchedToken);
    console.log("pair: ", pair);

    // 2. query launch state
    let launchState = await pot2pumpUtils.queryLaunchState(pair);
    console.log("launchState: ", launchState);

    // 3. query remaining amount to launch successfully
    const minCap = await pot2pumpUtils.queryRaisedTokenMinCap(RAISED_TOKEN);
    const remainingAmount = await pot2pumpUtils.queryRemainingAmountToLaunch(pair, minCap);
    console.log("remainingAmount: ", remainingAmount);

    // 4. deposit launch
    await depositLaunch(launchedToken, ethers.formatEther(remainingAmount));

    // 5. query launch state
    launchState = await pot2pumpUtils.queryLaunchState(pair);
    console.log("launchState: ", launchState);

    // 6. if launch is successful, perform will create ichivault and return ichivault address
    let ichivault = "";
    if (launchState.toString() === LaunchState.Success.toString()) {
        ({ ichivault } = await perform(pair));
        console.log("ichivault: ", ichivault);
    }

    // 7. claim LP from launchpad
    await claimLP(pair, wallet.address);

    // 8. withdraw LP from ichivault
    // if (ichivault !== "") {
    const withdrawableLPAmount = await withdrawableIChivaultLP(ichivault);
    console.log("withdrawableLPAmount: ", withdrawableLPAmount);
    await withdrawIChivaultLP(ichivault, withdrawableLPAmount, wallet.address);
    // }

    // 9. deposit launchToken to ichivault, note: currently ichivault deposit is supported after 60 minutes by default
    const depositAmount = ethers.parseEther("1");
    await depositIChivault(pair, ichivault, launchedToken, depositAmount);
}

main();
