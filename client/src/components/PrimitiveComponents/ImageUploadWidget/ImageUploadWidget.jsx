import React, { useState, useEffect } from "react";
import WindowControlButton from "../WindowControlButton/WindowControlButton";
import "./ImageUploadWidget.css";

export default function ImageUploadWidget({
  onImageSelect,
  index,
  onImageRemove,
  image,
}) {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  // Set the preview based on the type of image (File or URL)
  useEffect(() => {
    if (image instanceof File) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof image === 'string') {
      setPreview(image);
    } else {
      setPreview(undefined);
    }
  }, [image]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      onImageSelect(null, index);
      return;
    }
    const file = e.target.files[0];
    setSelectedFile(file);
    onImageSelect(file, index);
  };

  const handleRemove = () => {
    setSelectedFile(undefined);
    onImageRemove(index);
  };

  return (
    <div
      className="image-upload-widget"
      style={{
        backgroundImage: preview ? `url(${preview})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <input type="file" onChange={onSelectFile} />
      {!preview && <span>Upload Image</span>}
      {preview && (
        <WindowControlButton
          action={handleRemove}
          text="remove"
          className="image-remove-button"
          icon="delete"
        />
      )}
    </div>
  );
}
