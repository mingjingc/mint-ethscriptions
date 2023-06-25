const ethers = require('ethers');
const readline = require('readline');
const util = require('util');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = util.promisify(rl.question).bind(rl);

function createText(tick, id) {
  return `data:,{"p":"erc-20","op":"mint","tick":"${tick}","id":"${id}","amt":"1000"}`
}

function stringToHex(string) {
  return '0x' + Buffer.from(string, 'utf8').toString('hex');
}

// 批量mint Ethscriptions
async function batchMintEthscriptions(wallet, toAddress, from, count, tick) {
  let nonce = await wallet.getTransactionCount()
  const list = []
  for (let i = from; i < from + count; i++) {
    const hexDataURI = stringToHex(createText(i));

    const tx = {
      to: toAddress,
      value: ethers.utils.parseEther('0'),
      data: hexDataURI,
      nonce: nonce++
    };

    // 使用你的钱包发送交易
    const txResponse = await wallet.sendTransaction(tx);
    console.log(`Transaction hash: ${txResponse.hash}, id: ${i}`);

    list.push(txResponse)

    // 等待交易被矿工确认
    // const receipt = await txResponse.wait();
    // console.log(`Transaction was confirmed in block ${receipt.blockNumber}`);
  }

  await Promise.all(list)
  console.log('Done')
}

async function main() {
  console.log('Ethscriptions小工具～')
  const pk = await question('请输入私钥(十六进制): ');
  const toAddress = await question('输入目标地址(十六进制): ')
  const from = await question('请输入起始ID: ')
  const count = await question('请输入数量: ')
  const tick = await question('请输入tick: ')

  // 如果rpc连接有问题可更改rpc链接，像infura、quicknode
  const providerUrl = "https://rpc.ankr.com/eth"; 
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);

  const wallet = new ethers.Wallet(pk, provider)

  await batchMintEthscriptions(wallet, toAddress, parseInt(from, 10), parseInt(count, 10), tick)

  process.exit()
}

main()