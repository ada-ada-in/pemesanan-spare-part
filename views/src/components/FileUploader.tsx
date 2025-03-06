import React, { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface FileUploaderProps {
  token: string;
  id: string | number;
  uploadUrl: string;
}

export default function FileUploader({
  token,
  id,
  uploadUrl,
}: FileUploaderProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
      setUploadStatus(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${uploadUrl}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Image uploaded successfully!");
        setUploadStatus("Upload Successful!");
        router.push("/user/transaksi");
      } else {
        toast.error(result?.message || "Failed to upload image.");
        setUploadStatus("Upload Failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file.");
      setUploadStatus("Upload Failed.");
    }
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
          <div className="row">
            <div className="col text-center">
              <Image
                src={"/assets/bca.jpeg"}
                width={240}
                height={240}
                alt="bca"
              />
              <p>Nomor Rekening : 819034567</p>
              <p>Atas Nama : PT.Jambi Motor Kencana Indah</p>
            </div>
            <div className="col text-center my-5">
              <Image
                className="mb-5"
                src={"/assets/mandiri.png"}
                width={240}
                height={240}
                alt="Mandiri"
              />
              <p>Nomor Rekening : 819034567</p>
              <p>Atas Nama : PT.Jambi Motor Kencana Indah</p>
            </div>
            <div className="col">
              <Image
                className="mb-5"
                src={"/assets/bninews.png"}
                width={240}
                height={240}
                alt="BNI"
              />
              <p>Nomor Rekening : 819034567</p>
              <p>Atas Nama : PT.Jambi Motor Kencana Indah</p>
            </div>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="relative w-4/5 h-32 max-w-xs mb-10 bg-white bg-gray-100 rounded-lg shadow-inner"
        >
          <input
            type="file"
            id="file-upload"
            accept="image/png, image/jpeg, image/jpg, application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="z-20 flex flex-col-reverse items-center justify-center w-full h-full cursor-pointer"
          >
            <p className="z-10 text-xs font-light text-center text-gray-500">
              Drag & Drop your files here or click to browse
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
              uploadStatus === "Upload Successful!"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {uploadStatus}
          </p>
        )}
        {imagePreview && (
          <Image
            src={imagePreview}
            alt="Image Preview"
            width={128}
            height={128}
            className="mt-4 w-32 h-32 object-cover"
          />
        )}
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
