import { ethers } from "ethers";
import { pot2pumpFactoryABI } from "pot2pump-sdk";

import dotenv from 'dotenv';
dotenv.config();

export async function createLaunch(): Promise<{ launchedToken: string, pair: string }> {
    
    // init provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

    // pot2pump factory address
    const pot2PumpFactoryAddress = "0x1c0c97685e54a2132ab13cfaf9df2ed4f9bff6db";
    // pool handler address
    const nonfungiblePositionManager = "0x29a738deAFdd2c6806e2f66891D812A311799828";

    // TODO: how to get raised token address from pot2pump-sdk
    // raised token address
    const raisedToken = "0xfc5e3743E9FAC8BB60408797607352E24Db7d65E";

    // Define create Launch Params
    const launchName = "TEST";
    const launchSymbol = "TEST";

    // Create Launch
    const pot2PumpFactory = new ethers.Contract(
        pot2PumpFactoryAddress,
        pot2pumpFactoryABI,
        wallet);
    const launchTx = await pot2PumpFactory.createPair(
        [
            raisedToken,
            launchName,
            launchSymbol,
            nonfungiblePositionManager
        ]
    );

    const launchTxReceipt = await launchTx.wait();


    let launchedToken = "";
    let pair = "";

    // parse PairCreated event
    for (const log of launchTxReceipt.logs) {
        try {
            const parsedLog = pot2PumpFactory.interface.parseLog({
                topics: log.topics,
                data: log.data
            });

            if (parsedLog && parsedLog.name === pot2PumpFactory.getEvent('PairCreated').name) {
                launchedToken = parsedLog.args.launchedToken;
                pair = parsedLog.args.pair;
            }
        } catch (e) {
            continue;
        }
    }

    // console.log(launchedToken);
    // console.log(pair);
    return {
        launchedToken,
        pair
    }
}
