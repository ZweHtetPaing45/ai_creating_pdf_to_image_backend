import { PdfConverterService } from "../../../infrastructure/services/pdf-converter.service";


export class DeletePdfImagesUseCase{

    constructor(
        private readonly pdfConverter: PdfConverterService
    ){}

    async execute(folderName: string): Promise<void>{

        await this.pdfConverter.deleteImage(folderName);

    }

}