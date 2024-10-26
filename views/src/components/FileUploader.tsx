import { useState } from "react";
import { postData } from "@/libs/handlerData";

export default function FileUploader(url: any) {
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
      ];
      if (validTypes.includes(file.type)) {
        setUploadStatus("Upload Successful!");
      } else {
        setUploadStatus(
          "Invalid file type. Please upload a .png, .jpeg, .jpg, or .pdf file."
        );
      }
    }
  };

  const handleClick = (e: any) => {
    e.preventDefault();
    try {
    } catch (error) {}
  };

  return (
    <div className="flex justify-center w-full mx-auto sm:max-w-lg">
      <div className="flex flex-col items-center justify-center w-full h-auto my-20 sm:w-3/4 sm:rounded-lg">
        <div className="mt-10 mb-10 text-center">
          <h2 className="text-2xl font-semibold mb-2">
            Upload Bukti Pembayaran
          </h2>
          <p className="text-xs text-gray-500">
            File should be of format .png, .jpeg, .jpg or .pdf
          </p>
        </div>
        <form
          action="#"
          className="relative w-4/5 h-32 max-w-xs mb-10 bg-white bg-gray-100 rounded-lg shadow-inner"
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="z-20 flex flex-col-reverse items-center justify-center w-full h-full cursor-pointer"
          >
            <p className="z-10 text-xs font-light text-center text-gray-500">
              Drag & Drop your files here
            </p>
            <svg
              className="z-10 w-8 h-8 text-indigo-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
            </svg>
          </label>
        </form>
        {uploadStatus && (
          <p
            className={`mt-4 text-sm font-medium ${
              uploadStatus.includes("Successful")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {uploadStatus}
          </p>
        )}
        {uploadStatus === "Upload Successful!" && (
          <button className="mt-4 px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none">
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
