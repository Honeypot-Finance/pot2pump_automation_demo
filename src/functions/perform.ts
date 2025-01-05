import { ethers } from "ethers";
import { pot2pumpPairABI } from "../abis";
import dotenv from 'dotenv';
dotenv.config();

export async function perform(_pot2pumpPair: string): Promise<{ ichivault: string }> {
    console.log("Performing... pot2pumpPair: ", _pot2pumpPair);
    // init provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

    // pot2pump pair address
    const pot2pumpPair = _pot2pumpPair;

    // pot2pump pair contract
    const pot2pumpPairContract = new ethers.Contract(pot2pumpPair, pot2pumpPairABI, wallet);


    try {
        // finalize pair completion, create ichivault
        const finalizePairCompletionTx = await pot2pumpPairContract.finalizePairCompletion();
        const receipt = await finalizePairCompletionTx.wait();
        console.log("finalizePairCompletionTx:", receipt.hash);

        const lpToken = await pot2pumpPairContract.lpToken();

        return { ichivault: lpToken };
    } catch (error: any) {
        console.log("Error details:", {
            message: error.message,
            data: error.data,
            reason: error.reason,
            code: error.code,
            transaction: error.transaction
        });

        // 如果是合约调用错误，尝试解码错误信息
        if (error.data) {
            const iface = new ethers.Interface(pot2pumpPairContract.interface.fragments);
            try {
                const decodedError = iface.parseError(error.data);
                console.log("Decoded error:", decodedError);
            } catch (e) {
                console.log("Could not decode error");
            }
        }
        throw error;
    }

}