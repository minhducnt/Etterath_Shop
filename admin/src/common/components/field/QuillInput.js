import React, { useRef } from 'react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function QuillInput(field) {
  const { formik, name, value, isReadOnly, height } = field;
  const quillRef = useRef(null);

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      theme="snow"
      onChange={val => formik?.setFieldValue(name, val)}
      readOnly={isReadOnly}
      style={{
        backgroundColor: isReadOnly ? '#f7f7f7' : 'white',
        minHeight: height,
        maxHeight: height,
        height: height,
        paddingBottom: '2.5rem'
      }}
    />
  );
}

export default QuillInput;
