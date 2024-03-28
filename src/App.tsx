import React from "react";
import { useEffect, useState } from "react";
import ImageUpload from "./components/ImageUpload";
import Resizer from "react-image-file-resizer";
import { myBucket } from "./aws";

interface FilesType {
  name: string;
  file: File;
}

function App() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const resizeFile = (file: File, width: number, height: number) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        width,
        height,
        file.type.split("/")[1],
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    });

  const uploadFile = async (file: File) => {
    if (!file) return;
    setProgress(0);
    setLoading(true);
    try {
      const thumpnail = await resizeFile(file, 100, 100);
      const originImage = await resizeFile(file, 200, 200);
      console.log("🚀 ~ uploadFile ~ originImage:", originImage);

      const files: FilesType[] = [
        {
          file: thumpnail,
          name: `thumpnail-${thumpnail.name}`,
        },
        {
          file: originImage,
          name: `${thumpnail.name}`,
        },
      ];
      // for (let image of files) {
      //   const params = {
      //     Body: image.file,
      //     Bucket: import.meta.env.VITE_APP_S3_BUCKET,
      //     Key: image.name,
      //   };
      //   await myBucket.putObject(params).promise();
      // }
      setProgress(100);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Upload failed:", error);
    }
  };

  useEffect(() => {
    if (progress === 100) {
      setFile(null);
      setProgress(0);
    }
  }, [progress]);

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="p-4 flex-1">
          <h1 className="text-blue-500 font-bold text-4xl text-center mb-6">
            FILE UPLOAD
          </h1>
          {file ? (
            <div className="flex items-center justify-center">
              <img
                className="w-[200px] h-auto"
                src={URL.createObjectURL(file)}
                alt="Selected Image"
              />
            </div>
          ) : (
            <ImageUpload file={file} setFile={setFile} />
          )}

          <div className="w-full flex flex-col items-center justify-center mt-6">
            <button
              className={`${
                loading && "cursor-not-allowed"
              } bg-blue-500 text-white px-4 py-2 w-60 hover:opacity-90 hover:scale-95 transition-transform duration-200 rounded-sm`}
              type="button"
              disabled={loading ? true : false}
              onClick={() => uploadFile(file)}
            >
              {!loading ? "Upload" : "Loading..."}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
