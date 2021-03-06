const Web3 = require("web3");
const web3 = new Web3();
// web3.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:22001"));
web3.setProvider(new Web3.providers.HttpProvider("http://quorum.tw-wallet.in2e.com:22001"));

const abi = require("../build/contracts/HealthVerificationClaim.json").abi;

const contractAddress = '0x81845481fD51Efd88fd44e8983a60CEcF3886552';
const HealthyClaimContract = new web3.eth.Contract(abi, contractAddress);

const userAddress = "0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e";
const userAddressPK = "4762e04d10832808a0aebdaa79c12de54afbe006bfffd228b3abcc494fe986f9";

async function getHealthyClaim(claimId) {
    HealthyClaimContract.methods.getHealthVerification(claimId)
        .call(null, (error, result) => {
            console.log(result);
        });
}

async function createHealthyClaim(claimId, ownerId) {
    const createHealthyClaimMethod = HealthyClaimContract.methods.createHealthVerification(userAddress, claimId, ownerId, `DID:TW:${userAddress}`);

    const data = createHealthyClaimMethod.encodeABI();
    const nonce = await web3.eth.getTransactionCount(userAddress);

    const tx = await web3.eth.accounts.signTransaction({
        nonce: web3.utils.toHex(nonce),
        to: contractAddress,
        gasPrice: 0,
        gas: 3000000,
        data: data
    }, userAddressPK);
    const rawSignedTransaction = tx.rawTransaction;

    console.log(`rawSignedTransaction:${rawSignedTransaction}`);

    // send raw signed transaction
    const receipt = await web3.eth.sendSignedTransaction(rawSignedTransaction);
    console.log(receipt);
    console.log(`receipt: ${JSON.stringify(receipt.blockHash, null, 4)}`);
}


// createHealthyClaim('DID:TW:Ge8wZTMxMynwoBGcLCDpNS3xnssZ3F6374tTqcfa', 'DID:TW:C304A5079E5898B55B6dCAFD5243f1660cc3062A');
getHealthyClaim('DID:TW:8nog6PfJJKtY5GKdfVJvZ3Aw5TKnb9QSz6FALZtp');
