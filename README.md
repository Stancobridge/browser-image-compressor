# NO NAME FOR THIS PROJECT - YOU CAN CONTRIBUTE TO MAKE IT BIGGER

## Purpose

I was working on a project their was a need to optimize the platform for users with poor network,
Initially the image compression was done on server backend but this does not help with for uploading the image to the server for big files, instead of server optimization, we planned optimizing in browser first, then leaving the server with minor optimize, this reduced the bandwidth or cpu usage of the server and also make the uploading of image faster from the browser.

## Note

The functionality of the code is based on a project that am working on while developing this compressor, please use with care. If you understand the code, you are free to copy and edit it to suit the purpose you are using it for.

## Usage

```js
    const [file] = document.querySelector('.file-selector').files;

    compressImage(file, (sendToServer) => {
        console.log(URL.createObjectURL(sendToServer))
        let formData = new FormData();
        formData.append('image', sendToServer);

        fetch("/upload", {
            method: "POST",
            body: formData
        })
        .then(resp => resp.text() )
        .then(text => {

        });


    })

```

### Might visit this anytime in the future