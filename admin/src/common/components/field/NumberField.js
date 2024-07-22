import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react';

import React from 'react';

function NumberField(field) {
  const { formik, name, value, isReadOnly } = field;

  return (
    <NumberInput {...field} value={value} step={1} onChange={val => formik.setFieldValue(name, val)}>
      <NumberInputField bg={isReadOnly ? '#f9f9f9' : 'white'} />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
}

export default NumberField;
