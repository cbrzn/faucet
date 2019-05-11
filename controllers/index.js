import express from 'express';
import Web3 from 'web3';

const router = express.Router();

const faucet = async (req, res) => {
    try {
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RINKEBY_ENDPOINT));
        web3.eth.defaultAccount = process.env.PROVIDER_ADDRESS
        const senderBalanceInWei = await web3.eth.getBalance(web3.eth.defaultAccount)
        const ethBalance = web3.utils.fromWei(senderBalanceInWei, 'ether')
        res.send(`Balance of faucet: ${ethBalance}`)
    } catch (error) {
        console.log(error)
    }
}

router.get('/send_ether/:wallet', faucet)

export default router;