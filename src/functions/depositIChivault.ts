import { ethers } from "ethers";
import { erc20ABI, ichivaultDepositGuardABI } from "../abis";

import dotenv from 'dotenv';
import { ICHIVAU_DEPOSIT_GUARD } from "../constants/constants";
dotenv.config();

export async function depositIChivault(pair: string, ichivault: string, launchedToken: string, depositAmount: bigint): Promise<void> {
    // init provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

    // Approve raised token to pot2pump facade
    const raisedTokenContract = new ethers.Contract(launchedToken, erc20ABI, wallet);
    const approveTx = await raisedTokenContract.approve(ICHIVAU_DEPOSIT_GUARD, depositAmount);
    const approveTxReceipt = await approveTx.wait(2);

    console.log("Approve Tx:", approveTxReceipt.hash);

    // Deposit launched token to ichivault
    const ichivaultDepositGuardContract = new ethers.Contract(ICHIVAU_DEPOSIT_GUARD, ichivaultDepositGuardABI, wallet);
    const depositTx = await ichivaultDepositGuardContract.forwardDepositToICHIVault(
        ichivault,
        pair,
        launchedToken,
        depositAmount,
        0,
        wallet.address,
        {
            gasLimit: 20000000,
            maxFeePerGas: ethers.parseUnits("200", "gwei"),
            maxPriorityFeePerGas: ethers.parseUnits("200", "gwei"),
        }
    )
    const depositTxReceipt = await depositTx.wait(2);
    console.log("Deposit Tx:", depositTxReceipt.hash);

}

async function main() {
    const ichivault = "0x9579825b2305bdd3d77CBa0786b2d76f24E904e3";
    const launchedToken = "0x9ABDB87B7508AD07B656019a7Be0e9533c3D9B32";
    const depositAmount = ethers.parseEther("1");
    const pair = "0x41Ba164cc5c931983c5d9210964519BDa7093326";
    await depositIChivault(pair, ichivault, launchedToken, depositAmount);

}

main();