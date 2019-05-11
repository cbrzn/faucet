import express from 'express';
import faucet from '../controllers';

const router = express.Router();

router.use('/', faucet);

export default router;