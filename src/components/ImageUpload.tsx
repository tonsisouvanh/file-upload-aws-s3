import upload from "../assets/upload.svg";

type Props = {
  file?: File;
  setFile: (file: File) => void;
};

const ImageUpload = ({ setFile }: Props) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="border-2 bg-blue-50 hover:opacity-60 transition duration-300 group border-blue-500 w-[40rem] h-[20rem] flex items-center justify-center border-dashed">
        <label
          htmlFor="file-upload"
          className="w-full h-full cursor-pointer flex items-center justify-center"
        >
          <div className="flex flex-col items-center justify-center">
            <img className="w-44 h-44 object-cover" src={upload} alt="" />
            <p className="font-semibold text-blue-400">Click to upload</p>
          </div>
          <input
            id="file-upload"
            onChange={handleFileChange}
            type="file"
            className="w-full h-full hidden border"
          />
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
