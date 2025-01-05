import { ethers } from "ethers";
import { erc20ABI } from "pot2pump-sdk";

import dotenv from 'dotenv';
dotenv.config();

export async function depositIChivault(): Promise<void> {
    // init provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

    // TODO:

}
