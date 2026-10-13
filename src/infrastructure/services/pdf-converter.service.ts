import { pdf } from "pdf-to-img";
import { IPdfConverter } from '../../application/interface/service/pdf-converter.interface';
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { env } from "../../config/env";


const host = env.HOST;
const port = env.PORT;

// PDF coordinates use 72 points per inch. Render at OCR resolution directly;
// enlarging a 144-DPI bitmap afterwards cannot recover fine glyph details.
const OCR_DPI = 300;
const PDF_POINTS_PER_INCH = 72;
// pdf-to-img uses POSIX path helpers internally, which lose Windows backslashes.
// Resolve natively first, then use forward slashes required by PDF.js factories.
const pdfJsDirectory = path.dirname(require.resolve("pdfjs-dist/package.json")).replace(/\\/g, "/");

export class PdfConverterService implements IPdfConverter {


    async convert(pdfPath: string): Promise<{images: string[],uploadPdf: string}>{


        // pdf file name ရယူ
        const fileName = path.basename(pdfPath, path.extname(pdfPath)).replace(/^\d+-/,"");

        const outputDir = path.join(
            "./uploads/pages",
            fileName
        );

        await fs.mkdir(outputDir, {
            recursive: true
        });


        const document = await pdf(pdfPath, {
            scale: OCR_DPI / PDF_POINTS_PER_INCH,
            renderParams: { background: "rgb(255,255,255)" },
            docInitParams: {
                standardFontDataUrl: `${pdfJsDirectory}/standard_fonts/`,
                cMapUrl: `${pdfJsDirectory}/cmaps/`,
                cMapPacked: true,
                wasmUrl: `${pdfJsDirectory}/wasm/`
            }
        });


        const images: string[] = [];

        let pageNumber = 1;


        try {
            // Keep pages sequential to avoid processing several large bitmaps at once.
            for await (const image of document) {

                const filePath = path.join(
                    outputDir,
                    `page-${pageNumber}.png`
                );

                // Preserve colour, faint strokes and diacritics. Thresholding or
                // aggressive sharpening can erase or merge characters (e.g. Myanmar).
                await sharp(image)
                    .flatten({ background: "#ffffff" })
                    .withMetadata({ density: OCR_DPI })
                    .png({ compressionLevel: 6, palette: false })
                    .toFile(filePath);

                images.push(`http://${host}:${port}/${filePath.replace(/\\/g,"/")}`);

                pageNumber++;
            }
        } finally {
            // pdf-to-img does not automatically release the document after iteration.
            await document.destroy();
        }

        return {images,uploadPdf: `http://${host}:${port}/uploads/${fileName}.pdf`};
    }

    async deleteImage(folderName: string): Promise<void>{

        // const safeFolderName = path.basename(folderName);

        // console.log("safe Folder Name",safeFolderName);

        const outputDir = path.join(
            process.cwd(),
            "uploads",
            "pages",
            folderName.replace(/\//g,"\/")
        );

        // console.log("Delete folder: ",outputDir);

        await fs.rm(outputDir,{recursive: true,force: true});

    }

}
