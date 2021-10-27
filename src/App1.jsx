import './App.css';
import React, { useState } from 'react';
import saveAs from "file-saver";
import CryptoJS from 'crypto-js'

function App1() {
    const [file, setFile] = useState()
    const [file64, setFile64] = useState()
    const [encryptedFile, setEncryptedFile] = useState()
    const [iv, setIV] = useState()
    const SECRET = CryptoJS.enc.Latin1.stringify("0123456789")
    //console.log(file);
    //console.log(file64);

    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
    const upload = async () => {
        let reader = new FileReader();
        await reader.readAsDataURL(file)
        reader.onload = function () {
            console.log('file in base64');
            console.log(reader.result)
            setFile64(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };

    }
    const encrypt = () => {
        console.log("encrypt base64 file....");
        const encrypted = CryptoJS.AES.encrypt(file64.split(',')[1], SECRET, { padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });
        // console.log('file encrypted(no data attr)');
        console.log(encrypted.toString()); // is base64
        setIV(encrypted.iv)
        setEncryptedFile(encrypted.toString())
    }
    const decrypt = () => {
        console.log('decrypt file...');
        const decrypted = CryptoJS.AES.decrypt(encryptedFile, SECRET, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });
        console.log('base64 after decrypt(no data attr)');
        console.log(decrypted.toString(CryptoJS.enc.Base64));
        console.log(CryptoJS.enc.Base64.stringify(decrypted));
        // const tmp = CryptoJS.enc.Utf8.parse(decrypted)

        // console.log(CryptoJS.enc.Base64.parse(decrypted));
        // console.log(decrypted.toString(CryptoJS.enc.Base64));
        const blob = b64toBlob(decrypted.toString(CryptoJS.enc.Base64), 'application/x-zip-compressed')
        // console.log(blob);
        // saveAs(blob, 'img.zip')
    }
    const download = () => {
        // zip on windows = application/x-zip-compressed
        const blob = b64toBlob(file64.split(',')[1], 'application/x-zip-compressed')
        console.log(blob);
        saveAs(blob, 'img.zip')
    }
    return (
        <div className="App">
            Encrypt File
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={upload}>upload</button>
            <button onClick={encrypt}>encrypt</button>
            <button onClick={decrypt}>decrypt</button>
            <button onClick={download}>DownloadEncodedFile</button>
        </div>
    );
}

export default App1;
