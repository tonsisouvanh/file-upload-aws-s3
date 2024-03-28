import { useEffect, useState } from "react";
import ImageUpload from "./components/ImageUpload";
import Resizer from "react-image-file-resizer";
import { myBucket } from "./aws";

interface FilesType {
  file: File;
  name: string;
}
function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
          resolve(uri as string);
        },
        "file"
      );
    });

  const uploadFile = async (file: File | null) => {
    if (!file) return;
    setLoading(true);
    try {
      const thumbnail = (await resizeFile(file, 100, 100)) as File;
      const originImage = (await resizeFile(file, 200, 200)) as File;

      const files: FilesType[] = [
        {
          file: thumbnail,
          name: `thumbnail-${thumbnail.name}`,
        },
        {
          file: originImage as File,
          name: `${file.name}`,
        },
      ];

      for (const image of files) {
        const params = {
          Body: image.file,
          Bucket: import.meta.env.VITE_APP_S3_BUCKET as string,
          Key: image.name,
        };
        await myBucket.putObject(params).promise();
      }
      setLoading(false);
      alert("Upload complete!");
    } catch (error) {
      setLoading(false);
      console.error("Upload failed:", error);
      alert(error);
    }
  };

  useEffect(() => {
    if (!loading) {
      setFile(null);
    }
  }, [loading]);
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
                src={URL.createObjectURL(file as File)}
                alt="Selected Image"
              />
            </div>
          ) : (
            <ImageUpload setFile={setFile} />
          )}

          <div className="w-full gap-4 flex items-center justify-center mt-6">
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
            <button
              onClick={() => setFile(null)}
              className={`${
                loading && "cursor-not-allowed"
              } bg-red-500 text-white px-4 py-2 w-60 hover:opacity-90 hover:scale-95 transition-transform duration-200 rounded-sm`}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
