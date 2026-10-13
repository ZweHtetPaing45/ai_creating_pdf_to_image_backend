import { IPdfConverter } from "../../interface/service/pdf-converter.interface";


export class ConvertPdfToImageUseCase{

    constructor(
        private pdfConverter: IPdfConverter
    ){}


    async execute(pdfPath: string){

        console.log('pdf path',pdfPath);

        const images = await this.pdfConverter.convert(pdfPath);

        return {
            totalPages: images.images.length,
            images
        };

    }

}