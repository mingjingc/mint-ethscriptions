const ethers = require('ethers');
const readline = require('readline');
const util = require('util');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = util.promisify(rl.question).bind(rl);

function createText(p,tick, id) {
  return `data:,{"p":"${p}","op":"mint","tick":"${tick}","id":"${id}","amt":"1000"}`
}

function stringToHex(string) {
  return '0x' + Buffer.from(string, 'utf8').toString('hex');
}

// 批量mint Ethscriptions
async function batchMintEthscriptions(wallet, toAddress, from, count, tick, p) {
  let nonce = await wallet.getNonce()
  const list = []
  for (let i = from; i < from + count; i++) {
    const hexDataURI = stringToHex(createText(p,tick,i));

    const tx = {
      to: toAddress,
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
  // let pk = await question('请输入私钥(十六进制): ');
  // const toAddress = await question('输入目标地址(十六进制): ')
  // const startId = await question('请输入起始ID: ')
  // const amount = await question('请输入数量: ')
  // const tick = await question('请输入tick: ')
  // const p = await question('请输入p: ')
  // const rpcUrl = await question('请输入rpcUrl: ')

  const pk = '' //钱包私钥
  const toAddress = '0xf4B542BEcc945E11a13Dd263bfB48407fBE5853c' /*目标地址*/
  const startId = 698083 //起始id
  const amount = 3 // 铸造数量
  const tick = 'bnbs' 
  const p = 'nrc-20'
  const rpcUrl = 'https://rpc.ankr.com/bsc' // rpc，如果是以太坊，请用以太坊的rpc

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(pk, provider)
  await batchMintEthscriptions(wallet, toAddress, parseInt(startId, 10), parseInt(amount, 10), tick, p)

  process.exit()
}

main()