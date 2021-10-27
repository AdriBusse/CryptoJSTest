import './App.css';
import React, { useState } from 'react';
import saveAs from "file-saver";
import CryptoJS from 'crypto-js'

function App() {
  const [file, setFile] = useState()
  const [fileAB, setFileAB] = useState()
  const [encryptedFile, setEncryptedFile] = useState()
  const SECRET = "0123456789"

  function convertWordArrayToUint8Array(wordArray) {
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length), index = 0, word, i;
    for (i = 0; i < length; i++) {
      word = arrayOfWords[i];
      uInt8Array[index++] = word >> 24;
      uInt8Array[index++] = (word >> 16) & 0xff;
      uInt8Array[index++] = (word >> 8) & 0xff;
      uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
  }
  const upload = async () => {
    let reader = new FileReader();
    await reader.readAsArrayBuffer(file)
    reader.onload = function () {
      console.log('file in ArrayBuffer');
      console.log(reader.result)
      setFileAB(reader.result)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  const encrypt = () => {
    console.log("encrypt ArrayBuffer file....");
    const wordarray = CryptoJS.lib.WordArray.create(fileAB)
    const encrypted = CryptoJS.AES.encrypt(wordarray, SECRET);
    console.log(encrypted.toString()); // is base64
    setEncryptedFile(encrypted.toString())

    // download encrypted file
    // const blob = new Blob([encrypted.toString()])
    // saveAs(blob, 'encrypted.zip.enc')
  }
  const decrypt = () => {
    console.log('decrypt file...');
    const decrypted = CryptoJS.AES.decrypt(encryptedFile, SECRET);
    const typedarray = convertWordArrayToUint8Array(decrypted)

    const blob = new Blob([typedarray])


    saveAs(blob, 'img.zip')
  }

  const decryptFile = () => {
    var reader = new FileReader();
    reader.onload = () => {

      var decrypted = CryptoJS.AES.decrypt(reader.result, SECRET);
      var typedArray = convertWordArrayToUint8Array(decrypted);

      var fileDec = new Blob([typedArray]);

      saveAs(fileDec, 'img.zip')
    };
    reader.readAsText(file);
  }

  return (
    <div className="App">
      Encrypt File
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={upload}>upload</button>
      <button onClick={encrypt}>encrypt</button>
      <button onClick={decrypt}>decrypt</button>
      <button onClick={decryptFile}>decrypt File</button>
    </div>
  );
}

export default App;
