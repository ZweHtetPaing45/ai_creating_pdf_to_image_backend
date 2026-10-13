import { Router } from "express";
import { pdfContainer } from "../../../../../container/pdf/pdf.container";
import { upload } from "../../middlewares/pdf/pdf.multer";

const router = Router();

//Post Method
router.post('/upload',upload.single("pdf"),pdfContainer.convert.bind(pdfContainer));
router.delete('/images',pdfContainer.deleteImages.bind(pdfContainer));


export default router;

