import { ethers } from "ethers";
import { pot2pumpFacadeABI, erc20ABI } from "../abis";


import dotenv from 'dotenv';
dotenv.config();

export async function depositLaunch(): Promise<void> {
    
    // init provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

    //
    
   
}
