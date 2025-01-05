import { ethers } from "ethers";
import { pot2pumpFacadeABI } from "pot2pump-sdk";
import { erc20ABI } from "pot2pump-sdk";


import dotenv from 'dotenv';
dotenv.config();

export async function depositLaunch(): Promise<void> {
    
    // init provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

    // TODO:
    
   
}
