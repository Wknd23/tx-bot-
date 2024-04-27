const { ethers } = require('ethers')
const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.bnbchain.org:8545") // Change This
const receiverWallet = '0xC0Ab6c28BA04F46F5a58c3a99aec81ceE541785c' // Change This
const privateKeys = ["0x7d98221e9faad7a1bc113923230b81be1c994608e051b34e564d04b6c0fa9eae"] // Change This

// Clear Console
console.clear() 

//ASCII Banner
var figlet = require('figlet');

figlet.text('TX - Bot', {
    font: 'Standard',
    horizontalLayout: 'default',
    width: 40,
    whitespaceBreak: false
}, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
    });

// Welcome Message
    
    provider.once('block', (transaction) => {
    console.log("Wallet Balance Auto Sender / Address Cleaner\n");
    console.log("- https://github.com/Wknd23/tx-bot\n");
    console.log("Current Network State :\n");
    console.log("Block Number : ",transaction);
    });
    provider.getGasPrice().then((gasPrice) => {
    gasPriceString = gasPrice.toString();
    console.log("Current Gas Price : ",gasPriceString);
    console.log("\n");
    });

const txBot = async () => {
    provider.on('block', async () => {
        const { chainId, name } = await provider.getNetwork();
        console.log('<', name, '>', 'Waiting for transaction...');       
        for (let i = 0; i < privateKeys.length; i++) {
            const _signer = new ethers.Wallet(privateKeys[i]);
            const signer = _signer.connect(provider);
            const balance = await provider.getBalance(signer.address);
            const gasPrice = await provider.getGasPrice(); // Get gas price here
            const amount = balance.sub(gasPrice.mul(21000)); // Calculate amount to send
            if (amount.gt(0)) {
                console.log('<', name, '>' , "New balance detected...");
                console.log('<', name, '>' , "Sending....");
                console.log('<', name, '>' , "Waiting transaction hash...");                
                try {
                    const transaction = await signer.sendTransaction({
                        to: receiverWallet,
                        value: amount,
                        gasLimit: ethers.utils.hexlify(100000) // 100 Gwei
                    }); 
                    console.log(transaction)                   
                } finally {
                    console.log('<', name, '>' , "Success ✓");
                    console.log('<', name, '>' , `Total amount : ~${ethers.utils.formatEther(balance)}`);
                }
            }
        }
    })
}

txBot();
