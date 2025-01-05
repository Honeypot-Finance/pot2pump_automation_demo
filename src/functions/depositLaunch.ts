import { ethers } from "ethers";
import { pot2pumpFacadeABI, erc20ABI } from "../abis";
import { POT2PUMP_FACADE_ADDRESS, RAISED_TOKEN } from "../constants/constants";

import dotenv from 'dotenv';
dotenv.config();

export async function depositLaunch(_launchedToken: string, _depositAmount: string): Promise<void> {
    console.log("Depositing raised token to pot2pump facade... launchedToken: ", _launchedToken, "depositAmount: ", _depositAmount);
    // init provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

    // pot2pump facade address
    const pot2pumpFacadeAddress = POT2PUMP_FACADE_ADDRESS;


    // TODO: how to get raised token address from pot2pump-sdk
    // raised token address
    const raisedToken = RAISED_TOKEN;

    // launched token address
    const launchedToken = _launchedToken;

    const depositAmount = ethers.parseEther(_depositAmount);

    // Approve raised token to pot2pump facade
    const raisedTokenContract = new ethers.Contract(raisedToken, erc20ABI, wallet);
    const approveTx = await raisedTokenContract.approve(pot2pumpFacadeAddress, depositAmount);
    const approveTxReceipt = await approveTx.wait(2);

    console.log("Approve Tx:", approveTxReceipt.hash);


    // Deposit raised token to pot2pump facade
    const pot2PumpFacade = new ethers.Contract(
        pot2pumpFacadeAddress,
        pot2pumpFacadeABI,
        wallet);

    const depositTx = await pot2PumpFacade.deposit(launchedToken, depositAmount);
    const depositTxReceipt = await depositTx.wait();
    console.log("Deposit Tx:", depositTxReceipt.hash);


}
