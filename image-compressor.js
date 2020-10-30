// Load polyfill for toBlob
if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
        value: function(callback, type, quality) {
            var canvas = this;
            setTimeout(function() {
                var binStr = atob(
                        canvas.toDataURL(type, quality).split(",")[1]
                    ),
                    len = binStr.length,
                    arr = new Uint8Array(len);

                for (var i = 0; i < len; i++) {
                    arr[i] = binStr.charCodeAt(i);
                }

                callback(new Blob([arr], { type: type || "image/png" }));
            });
        }
    });
}

function compressImage(files, cb) {
    const reader = new FileReader();

    // const [imageFile] = files;
    if (files instanceof FileList) {
        var [imageFile] = files;
    }
    if (files instanceof File) {
        var imageFile = files;
    }

    const { name: filename } = imageFile; // File: name, size, type, lastModified
    reader.readAsDataURL(imageFile);

    const img = new Image();
    reader.onload = ({ target: { result } }) => {
        img.src = result;
        img.onload = e => {
            let { naturalWidth, naturalHeight } = img;
            // compress with and height
            naturalWidth = (85 / 100) * naturalWidth;
            naturalHeight = (85 / 100) * naturalHeight;

            const size = 800;
            let finalWidth = 0;
            let finalHeight = 0;
            // compress Image from front
            if (naturalWidth > size && naturalWidth - size > 100) {
                const getPercentDiff = (naturalWidth * 100) / size - 100;
                const getSizeToDeduct = (getPercentDiff / 100) * size;
                finalWidth = naturalWidth - getSizeToDeduct;

                // calculate percentage for width
                const getPercentEquiv = (100 * getSizeToDeduct) / naturalWidth;
                finalHeight = ((100 - getPercentEquiv) / 100) * naturalHeight;
            } else if (naturalHeight > size && naturalHeight - size > 100) {
                const getPercentDiff = (naturalHeight * 100) / size - 100;
                const getSizeToDeduct = (getPercentDiff / 100) * size;
                finalHeight = naturalHeight - getSizeToDeduct;

                // calculate percentage for width
                const getPercentEquiv = (100 * getSizeToDeduct) / naturalHeight;
                finalWidth = ((100 - getPercentEquiv) / 100) * naturalWidth;
            } else {
                finalWidth = (80 / 100) * naturalWidth;
                finalHeight = (80 / 100) * naturalHeight;
            }

            const canvas = document.createElement("canvas");
            canvas.width = finalWidth;
            canvas.height = finalHeight;

            // Image context
            const imageCtx = canvas.getContext("2d");


            imageCtx.drawImage(img, 0, 0, finalWidth, finalHeight);
            console.log(finalWidth, finalHeight)
            // convertImage to blob
            imageCtx.canvas.toBlob(
                blob => {
                    const file = new File([blob], filename, {
                        type: "image/jpeg",
                        lastModified: Date.now()
                    });
                    console.log(file.size);
                    if (cb) cb(file);
                    // document.querySelector(".c-image").src = URL.createObjectURL(file)
                },
                "image/jpeg",
                0.7
            );
            // document.querySelector(".c-image").src = imageCtx.canvas.toDataURL(e.target, 'image/jpeg')
        };
    };
}
