import { ethers } from "ethers";
import { pot2pumpFacadeABI, pot2pumpPairABI } from "../abis";
import { erc20ABI } from "../abis";


import dotenv from 'dotenv';
dotenv.config();

export async function claimableLP(_pair: string, _to: string): Promise<string> {
    // init provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

    const pot2pumpPair = new ethers.Contract(_pair, pot2pumpPairABI, wallet);

    const claimableLP = await pot2pumpPair.claimableLP(_to);
    return claimableLP;
}

export async function claimLP(_pair: string, _to: string): Promise<void> {
    // init provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

    const pot2pumpPair = new ethers.Contract(_pair, pot2pumpPairABI, wallet);

    const claimLP = await pot2pumpPair.claimLP(_to);
    const receipt = await claimLP.wait();
    console.log("claimLPTx:", receipt.hash);

}
