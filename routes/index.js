import express from "express";

const router = express.Router()

router.get('/get_ether/:wallet', (req, res) => {
    res.send({wallet: req.params.wallet})
})

export default router