import { Router } from 'express';
import { getMenuByQr } from '../controllers/menu.controller';

const router = Router();

router.get('/qr/:shortId', getMenuByQr);

export default router;
