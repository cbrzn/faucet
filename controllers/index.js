import express from 'express';
import Web3 from 'web3';

const router = express.Router();

const faucet = async (req, res) => {
    try {
        const { RINKEBY_ENDPOINT, PROVIDER_ADDRESS, ADDRESS_PRIVATE_KEY } = process.env
        const web3 = new Web3(new Web3.providers.HttpProvider(RINKEBY_ENDPOINT));
        web3.eth.defaultAccount = PROVIDER_ADDRESS;
        const { defaultAccount, getBalance, accounts, sendSignedTransaction, getTransactionCount } = web3.eth;
        const { toWei, fromWei } = web3.utils;
        const AMOUNT_TO_SEND = toWei('0.01', 'ether');
        const senderBalanceInWei = await getBalance(defaultAccount);
        const balanceInEth = fromWei(senderBalanceInWei, 'ether');
        const nonce = await getTransactionCount(defaultAccount);
        console.log(`Balance available in faucet: ${balanceInEth} ETH`);
        console.log(`Approx. balance available in faucet after transaction: ${+balanceInEth - 0.01 - 1e-14} ETH`);
        const transactionObject = {
            to: req.params.recipient,
            value: AMOUNT_TO_SEND,
            gas: 21000,
            nonce
        }
        const signedTransaction = await accounts.signTransaction(transactionObject, ADDRESS_PRIVATE_KEY);
        console.log('Sending ether...')
        sendSignedTransaction(signedTransaction.rawTransaction)
        .on('transactionHash', hash => {
            console.log(`Transaction done. Hash of transaction: ${hash}`);
            res.send({ status: 200, message: 'Transaction done', hash });
        })
        .on('error', error => {
            console.log(`An error has occured: ${error}`);
            res.send({ status: 503, message: 'An error has occured', error });
        })
    } catch (error) {
        console.log(error);
    }
}

router.get('/send_ether/:recipient', faucet);

export default router;