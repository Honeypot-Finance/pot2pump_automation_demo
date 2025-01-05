# Pot2Pump 启动脚本使用说明

这个脚本用于自动化执行 Pot2Pump 平台上的代币发行和流动性管理流程。

## 主要功能

脚本按顺序执行以下操作:

1. 创建代币Launch
   - 调用 createLaunch() 创建新代币和交易对
   - 输出新代币地址和交易对地址

2. 查询Launch状态
   - 使用 queryLaunchState() 检查Launch状态

3. 计算所需发行金额
   - 查询最小Launch额度(minCap)
   - 计算达到Launch要求还需要的金额

4. 存入资金
   - 调用 depositLaunch() 存入所需资金

5. 再次检查Launch状态
   - 确认Launch是否成功

6. 创建 ICHI Vault
   - 如果Launch成功,调用 perform() 创建 ICHI Vault
   - 获取 vault 地址

7. 领取 LP 代币
   - 从Pot2Pump平台领取 LP 代币

8. 从 ICHI Vault 提取 LP
   - 查询可提取的 LP 数量
   - 提取 LP 代币，获得LaunchToken跟RaisedToken

9. 存入代币到 ICHI Vault
   - 注意:需要等待 60 分钟后才能存入
   - 存入指定数量的LaunchToken

## 使用方法

1. 配置环境变量
   - RPC_URL: 区块链节点 RPC 地址
   - PRIVATE_KEY: 钱包私钥

2. 运行脚本


[note]
目前constants里配置的地址都是测试网地址，后续需要更新成主网部署的地址