import React from 'react';

import Select from 'react-select';

function CustomSelection({ isReadOnly, ...props }) {
  const { name, placeholder, formik, selectionArray } = props;

  const colorStyles = {
    control: (styles, { isDisabled }) => ({
      ...styles,
      backgroundColor: isDisabled ? '#f7f7f7' : 'white'
    }),
    input: styles => ({ ...styles }),
    placeholder: styles => ({ ...styles }),
    singleValue: (styles, { data }) => ({ ...styles })
  };

  return (
    <div>
      <Select
        name={name}
        options={selectionArray}
        styles={colorStyles}
        onChange={option => {
          formik.setFieldValue(name, option ? option.value : null);
          props.onChange(option);
        }}
        placeholder={placeholder ?? '---'}
        isClearable={true}
        isDisabled={isReadOnly}
        value={selectionArray.find(option => option.value === formik.values[name])}
      />
    </div>
  );
}

export default CustomSelection;
