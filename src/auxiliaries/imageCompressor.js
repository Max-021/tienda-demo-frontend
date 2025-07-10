import Compressor from "compressorjs";

export const IMG_WIDTH = 500;
export const IMG_HEIGHT = 500;
export const IMG_TYPE = "image/webp";

export function compressImage(file, {maxWidth = IMG_WIDTH, maxHeight = IMG_HEIGHT, quality = 0.5, mimeType = IMG_TYPE,} = {}) {
    return new Promise((resolve, reject) => {
        new Compressor(file, {
            quality,
            maxWidth,
            maxHeight,
            mimeType,
            convertSize: Infinity,
            success(result) {
                const outputFile = result instanceof File
                ? result
                : new File([result], file.name.replace(/\.\w+$/, '.webp'), { type: mimeType });
                resolve(outputFile);
            },
            error(err) {
                reject(err);
            },
        });
    });
}