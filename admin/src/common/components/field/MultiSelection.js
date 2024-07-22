import React from 'react';

import Select from 'react-select';

function MultiSelection({ isReadOnly, ...props }) {
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
        onChange={options => {
          formik.setFieldValue(name, options ? options.map(option => option.value) : []);
          props.onChange(options);
        }}
        placeholder={placeholder ?? '---'}
        isClearable={true}
        isDisabled={isReadOnly}
        isMulti
        value={selectionArray.filter(option => formik.values[name].includes(option.value))}
      />
    </div>
  );
}

export default MultiSelection;
