import { CameraAltOutlined } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";

const ImageInput = ({ field, className, updatedLogo }) => {

  const displayImage = async (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      setSelectedImage(e?.target?.result);
    };

    if (file) {
      if (typeof file !== "string") {
        reader?.readAsDataURL(file);
      }
    }
  };
  if (field?.value) {
    displayImage(field?.value);
  }

  // const [selectedImage, setSelectedImage] = useState(field?.value);
  const [selectedImage, setSelectedImage] = useState(
    updatedLogo || field?.value
  );

  useEffect(() => {
    if (updatedLogo) {
      setSelectedImage(updatedLogo); // Reflect new logo when updated
    }
  }, [updatedLogo]);
  const hiddenInputRef = useRef(null);
  const handleFileChange = (e) => {
    const file = e?.target?.files[0];

    displayImage(file);
  };

  const handleRemoveLogo = () => {
    setSelectedImage(null);
    field.onChange(null); // Remove the image from the field
  };

  return (
    <div className="relative w-full">
      <div
        className={`flex px-2 border-gray-200 border-[.5px] bg-[#f8f8ff59] py-[6px] items-center h-48 !w-full rounded-full justify-center !hover:bg-[ghostwhite] cursor-pointer transition-all !bg-cover ${className}`}
        style={{
          background: `linear-gradient(45deg, #f8f8ff59, #f8f8ff59), url(${
            typeof selectedImage !== "object"
              ? selectedImage?.includes("data:image")
                ? `${selectedImage}`
                : `${selectedImage}?v=${Date.now()}`
              : selectedImage
          })`,
        }}
        onClick={() => {
          hiddenInputRef.current.click();
        }}
      >
        <CameraAltOutlined className="!text-gray-700 !text-4xl" />
        <input
          type="file"
          accept="image/png,image/gif,image/jpeg,image/webp"
          id="logo_url"
          placeholder="placeholder"
          onChange={(e) => {
            field?.onChange(e?.target?.files[0]);
            handleFileChange(e);
          }}
          className="hidden"
          ref={hiddenInputRef}
        />
      </div>
      {selectedImage && (
        <button
          type="button"
          onClick={handleRemoveLogo}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ImageInput;
