import React, { useMemo, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone"; // importing components
import Compress from "client-compress";
import { withNamespaces } from "react-i18next";
import { connect } from "react-redux";

import "../assets/css/ImageDropzone.css"; // importing styles

function ImageDropzone({ t, props }) {
  // options for reducing file size
  const compress = new Compress({
    targetSize: 1,
  });

  // style attributes for dropzone container
  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: 1,
    borderRadius: 10,
    borderColor: "#eeeeee",
    boxShadow: "2px 2px 7px #000",
    fontSize: "large",
    outline: "none",
    transition: "border .24s ease-in-out",
    width: "100%",
    height: "100%",
    padding: "10px",
  };

  const activeStyle = {
    borderColor: "#2196f3",
  };

  const acceptStyle = {
    borderColor: "#666464",
  };

  const rejectStyle = {
    borderColor: "#ff1744",
  };

  const [errors, setErrors] = useState(""); // variable to store error messages

  // get properties for dropzone
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    // eslint-disable-next-line
    acceptedFiles,
    open,
  } = useDropzone({
    accept: "image/*",
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
    // when the user drops an image on the dropzone
    onDrop: (acceptedFiles, fileRejections) => {
      // if the are accepted files, we compress their size if required
      acceptedFiles.length &&
        compress.compress(acceptedFiles).then((images) => {
          // eslint-disable-next-line
          const { photo, info } = images[0];
          // creating new file from the compressed one
          const file = new File([photo.data], photo.name, {
            lastModified: new Date(),
            type: photo.type,
            path: photo.name,
          });
          setErrors("");
          props.setUploadedImages([
            Object.assign(file, { preview: URL.createObjectURL(file) }),
          ]);
        });

      // on error
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          // when the file is too large
          if (err.code === "file-too-large") {
            setErrors(t("File is too large"));
          }
          // when the file's type is not acccepted
          if (err.code === "file-invalid-type") {
            setErrors(t("File format is invalid"));
          }
          // when he user drops chooses more than one image
          if (err.code === "too-many-files") {
            setErrors(t("Too many files"));
          }
        });
      });
    },
  });

  // removes all images from the dropzone and from the state
  const removeImages = () => {
    setErrors("");
    props.setUploadedImages([]);
  };

  // setting style depending on the user's interaction
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    // eslint-disable-next-line
    [isDragActive, isDragReject]
  );

  const thumbs = props.files.map((file, i) => (
    <div className="thumb-image__holder" key={file.name}>
      <img className="thumb-image" src={file.preview} alt={file.name} />
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      props.files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [props.files]
  );

  return (
    <div className="dropzone-container">
      <div className="dropzone-container__content" {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {props.files.length === 0 ? (
          <div className="drop-title">
            {t("DRAG AND DROP HERE THE IMAGE")}
            <div className="drop-arrow">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : (
          <div className="images">{thumbs}</div>
        )}
        <div className="upload-buttons">
          <div className="image-errors">{errors}</div>
          <button className="upload-image__button" type="button" onClick={open}>
            {t("Choose an image")}
          </button>
          <button
            className="clear-images__button"
            type="button"
            onClick={removeImages}
          >
            {t("Remove the image")}
          </button>
        </div>
      </div>
    </div>
  );
}

// getting the global state variables with redux
const mapStateToProps = (state, ownProps) => {
  const props = {
    files: ownProps.files,
    setUploadedImages: ownProps.setUploadedImages,
  };
  return { props };
};

export default connect(mapStateToProps)(withNamespaces()(ImageDropzone));
