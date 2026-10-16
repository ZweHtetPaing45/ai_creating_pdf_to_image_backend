import { Request,Response,NextFunction } from "express";
import { ConvertPdfToImageUseCase } from "../../../../../application/usecase/pdf-to-image/convert-pdf-to-image.usecase";
import { AppError } from "../../../../../application/errors/app-error";
import { DeletePdfImagesUseCase } from "../../../../../application/usecase/pdf-to-image/delete-pdf-to-images.usecase";


export class PdfController{

    constructor(
        private convertPdfUseCase : ConvertPdfToImageUseCase,
        private deletePdfImageUseCase : DeletePdfImagesUseCase
    ){}


    async convert(req:Request,res:Response,next: NextFunction){

        try{

            console.log('controller working')

            const file = (req as any).file;
            
            const result = await this.convertPdfUseCase.execute(file!.path);

            res.json({
                success:true,
                message: "From pdf to image change successfully",
                result
            })

        }catch(error){

            next(error);
        }

    }


    async deleteImages(req: Request,res: Response,next: NextFunction){

        try{

            const {folderName} = req.body;
            
            if(!folderName)throw new AppError("Folder Name is required",400);

            await this.deletePdfImageUseCase.execute(folderName);

            return res.status(200).json({
                success: true,
                message : "PDF images deleted successfully"
            });


        }catch(error){
            next(error);
        }

    }
    
    
}