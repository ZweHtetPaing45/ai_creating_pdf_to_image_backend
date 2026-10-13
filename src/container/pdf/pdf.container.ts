import { PdfConverterService } from "../../infrastructure/services/pdf-converter.service";
import { ConvertPdfToImageUseCase } from "../../application/usecase/pdf-to-image/convert-pdf-to-image.usecase";
import { PdfController } from "../../interface/http/v1/controller/pdf/pdf.controller";
import { DeletePdfImagesUseCase } from "../../application/usecase/pdf-to-image/delete-pdf-to-images.usecase";

const pdfService = new PdfConverterService();

const convertPdfUseCase = new ConvertPdfToImageUseCase(pdfService);
const deletePdfImagesUseCase = new DeletePdfImagesUseCase(pdfService);

export const pdfContainer = new PdfController(convertPdfUseCase,deletePdfImagesUseCase);