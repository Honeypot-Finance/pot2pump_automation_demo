import { ethers } from "ethers";
import { pot2pumpFactoryABI } from "pot2pump-sdk";

import dotenv from 'dotenv';
import { POT2PUMP_FACTORY_ADDRESS, NONFUNGIBLE_POSITION_MANAGER, RAISED_TOKEN } from "./constants/constants";
dotenv.config();

export async function createLaunch(_name: string, _symbol: string): Promise<{ launchedToken: string, pair: string }> {
    console.log("Creating launch... name: ", _name, "symbol: ", _symbol);
    
    // init provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

    // pot2pump factory address
    const pot2PumpFactoryAddress = POT2PUMP_FACTORY_ADDRESS;
    // pool handler address
    const nonfungiblePositionManager = NONFUNGIBLE_POSITION_MANAGER;

    // TODO: how to get raised token address from pot2pump-sdk
    // raised token address
    const raisedToken = RAISED_TOKEN;

    // Define create Launch Params
    const launchName = _name;
    const launchSymbol = _symbol;

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
    console.log("Launch Tx:", launchTxReceipt.hash);


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
