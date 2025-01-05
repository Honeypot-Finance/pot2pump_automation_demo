# Pot2Pump Launch Script Guide

This script automates the token issuance and liquidity management process on the Pot2Pump platform.

## Main Functions

The script executes the following operations in sequence:

1. Create Token Launch
   - Call createLaunch() to create new token and trading pair
   - Output new token address and trading pair address

2. Query Launch Status
   - Use queryLaunchState() to check Launch status

3. Calculate Required Issuance Amount
   - Query minimum Launch amount (minCap)
   - Calculate remaining amount needed to meet Launch requirements

4. Deposit Funds
   - Call depositLaunch() to deposit required funds

5. Recheck Launch Status
   - Confirm if Launch is successful

6. Create ICHI Vault
   - If Launch successful, call perform() to create ICHI Vault
   - Get vault address

7. Claim LP Tokens
   - Claim LP tokens from Pot2Pump platform

8. Withdraw LP from ICHI Vault
   - Query withdrawable LP amount
   - Withdraw LP tokens to receive LaunchToken and RaisedToken

9. Deposit Tokens to ICHI Vault
   - Note: Must wait 60 minutes before depositing
   - Deposit specified amount of LaunchToken

## Usage Instructions

1. Configure Environment Variables
   - RPC_URL: Blockchain node RPC address
   - PRIVATE_KEY: Wallet private key

2. Run Script


[note]
The addresses configured in constants are currently testnet addresses, which will need to be updated to mainnet deployment addresses later

[usage]
```
ts-node src/index.ts
```