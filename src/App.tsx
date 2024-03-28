import { useEffect, useState } from "react";
import ImageUpload from "./components/ImageUpload";
import Resizer from "react-image-file-resizer";
import { s3Bucket } from "./aws";

// Define files type
interface FilesType {
  file: File;
  name: string;
}

// global style reduce duplicate class
const btnStyle =
  "text-white px-4 py-2 w-60 hover:opacity-90 hover:scale-95 transition-transform duration-200 rounded-sm";

function App() {
  // file state
  const [file, setFile] = useState<File | null>(null);
  // Image url state for url testing
  const [imageUrl, setimageUrl] = useState<string | null>(null);
  // Loading state when uploading
  const [loading, setLoading] = useState<boolean>(false);

  // Resize file with passed param using react libraries
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

  // Upload file function
  const uploadFile = async (file: File | null) => {
    // Check if file is selected
    if (!file) return;

    // Set loading state
    setLoading(true);

    try {
      // Resize file and then assign value to thumbnail variable 100*q00
      const thumbnail = (await resizeFile(file, 100, 100)) as File;
      // Resize file and then assign value to originImage variable 200*200
      const originImage = (await resizeFile(file, 200, 200)) as File;

      // Assign 2 variables above to files array
      const files: FilesType[] = [
        {
          file: thumbnail,
          name: `thumbnail-${thumbnail.name}`, // add thumbnail to file name
        },
        {
          file: originImage as File,
          name: `${file.name}`,
        },
      ];

      // Upalod files to S3
      for (const image of files) {
        const params = {
          Body: image.file,
          Bucket: import.meta.env.VITE_APP_S3_BUCKET as string,
          Key: image.name,
        };
        await s3Bucket.putObject(params).promise();
      }
      setLoading(false);
      alert("Upload complete!");
    } catch (error) {
      setLoading(false);
      console.error("Upload failed:", error);
      alert(error);
    }
  };

  // Set file state to null rely on loading value change
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
            // Upload image component
            <ImageUpload setFile={setFile} />
          )}

          <div className="w-full gap-4 flex-col flex items-center justify-center mt-6">
            <div className="space-x-4">
              <button
                className={`${
                  loading && "cursor-not-allowed"
                } bg-blue-500 ${btnStyle}`}
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
                } bg-red-500 ${btnStyle}`}
              >
                Clear
              </button>
            </div>
            <div className="flex flex-col justify-center">
              <input
                className="border w-80 mt-4 rounded-none px-2 py-1"
                placeholder="Paste image URL to test"
                onChange={(e) => setimageUrl(e.target.value)}
                type="text"
              />
              {imageUrl && (
                <img src={imageUrl as string} className="w-24" alt="" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
