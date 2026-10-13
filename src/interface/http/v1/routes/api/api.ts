import {Router} from 'express';
import PDFRouter from '../pdf/pdf.route';

const router = Router();


router.use('/pdf',PDFRouter);

export default router;