import { ethers } from "ethers";
import { POT2PUMP_FACTORY_ADDRESS } from "../constants/constants";
import { pot2pumpFactoryABI, pot2pumpPairABI } from "../abis";
import { LaunchState } from "../enum/LaunchState";

export class Pot2PumpUtils {

    private provider: ethers.JsonRpcProvider;
    private pot2pumpFactory: ethers.Contract;
    
    constructor(private _provider: ethers.JsonRpcProvider) {
        this.provider = _provider;
        this.pot2pumpFactory = new ethers.Contract(POT2PUMP_FACTORY_ADDRESS, pot2pumpFactoryABI, this.provider);
    }

    async queryRemainingAmountToLaunch(_pot2pumpPair: string, minCapWei: bigint): Promise<bigint> {
        const pot2pumpPair = new ethers.Contract(_pot2pumpPair, pot2pumpPairABI, this.provider);
        const raisedTokenAmount = await pot2pumpPair.depositedRaisedToken();
        const remainingAmount = minCapWei - raisedTokenAmount <= 0 ? 0 : minCapWei - raisedTokenAmount;
        return remainingAmount as bigint;
    }

    async queryLaunchState(_pot2pumpPair: string): Promise<LaunchState> {
        const pot2pumpPair = new ethers.Contract(_pot2pumpPair, pot2pumpPairABI, this.provider);
        const launchState = await pot2pumpPair.PairState();
        return launchState as LaunchState;
    }

    async queryRaisedTokenMinCap(raisedToken: string): Promise<bigint> {
        const minCapWei = await this.pot2pumpFactory.raisedTokenMinCaps(raisedToken);
        return minCapWei;
    }
}
