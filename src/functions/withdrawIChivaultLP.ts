import { ethers } from "ethers";
import { ichivaultABI, erc20ABI } from "../abis";


import dotenv from 'dotenv';
dotenv.config();

export async function withdrawableIChivaultLP(_ichivault: string): Promise<string> {
    // init provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

    const ichivault = new ethers.Contract(_ichivault, erc20ABI, wallet);
    const withdrawableLP = await ichivault.balanceOf(wallet.address);
    return withdrawableLP;
}

export async function withdrawIChivaultLP(_ichivault: string, _amount: string, _to: string): Promise<void> {
    // init provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

    const ichivault = new ethers.Contract(_ichivault, ichivaultABI, wallet);

    const withdraw = await ichivault.withdraw(_amount, _to);
    const receipt = await withdraw.wait();
    console.log("withdrawLP Tx:", receipt.hash);

}