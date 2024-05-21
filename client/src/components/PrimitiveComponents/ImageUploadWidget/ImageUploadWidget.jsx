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

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    console.log("file selected");
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
        backgroundImage: selectedFile ? `url(${preview})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <input type="file" onChange={onSelectFile} />
      {!selectedFile && <span>Upload Image</span>}
      {selectedFile && (
        //   <button className="image-remove-button" onClick={handleRemove}>remove</button>
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
