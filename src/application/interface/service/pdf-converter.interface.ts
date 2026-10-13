
export interface IPdfConverter{

convert(pdfPath: string): Promise<{images: string[],uploadPdf: string}>;

}