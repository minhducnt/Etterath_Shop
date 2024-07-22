import { useStyleConfig, Box } from '@chakra-ui/react';

import React from 'react';

import CurrencyInput from 'react-currency-input-field';

function CurrencyField(field) {
  const style = useStyleConfig('Input');

  return (
    <Box sx={style}>
      <CurrencyInput
        name="input-name"
        placeholder="Enter the price"
        value={field.value}
        decimalsLimit={2}
        allowNegativeValue={false}
        intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
        disabled={field.isReadOnly}
        onValueChange={(value, name, values) => {
          field.formik.setFieldValue(field.name, value);
        }}
        style={{
          width: '100%',
          border: '1px solid #E2E8F0',
          borderRadius: '4px'
        }}
      />
    </Box>
  );
}

export default CurrencyField;
