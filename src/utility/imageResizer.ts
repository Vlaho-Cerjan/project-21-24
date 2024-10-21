import Resizer from "react-image-file-resizer";

export const resizeFile = (file: File, width: number, height: number, type: string, quality: number) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            width,
            height,
            type,
            quality,
            0,
            (uri) => {
            resolve(uri);
            },
            "base64"
        );
});