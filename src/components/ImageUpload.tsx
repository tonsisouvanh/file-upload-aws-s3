const ImageUpload = ({ file, setFile }) => {
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="border-2 bg-blue-50 hover:opacity-60 transition duration-300 group border-blue-500 w-[40rem] h-[20rem] flex items-center justify-center border-dashed">
        <label
          htmlFor="file-upload"
          className="w-full h-full cursor-pointer flex items-center justify-center"
        >
          <div>
            <p className="">
              <span className="font-semibold text-blue-400">
                Click to upload
              </span>{" "}
              / drag and drop
            </p>
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
