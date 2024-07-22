import React from 'react';

function ImageUploadField({ ...props }) {
  const { name, formik } = props;

  const handleFileChange = event => {
    const files = event.currentTarget.files;
    formik.setFieldValue(name, files);
  };

  const handleUploadSingleFile = event => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue(name, file);
  };

  return (
    <div>
      <input
        type="file"
        name="avatar"
        multiple={name === 'images'}
        onChange={name === 'images' ? handleFileChange : handleUploadSingleFile}
      />
    </div>
  );
}

export default ImageUploadField;
