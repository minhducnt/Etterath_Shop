import { FormControl, FormErrorMessage, FormLabel, InputGroup, InputLeftAddon, InputRightAddon, VStack } from '@chakra-ui/react';
import { Input } from '@chakra-ui/input';

import { useField } from 'formik';

import { useState } from 'react';

import PasswordStrengthBar from 'react-password-strength-bar';

function AuthTextField({ ...props }) {
  const [{ value = '', ...field }, meta] = useField(props);
  const [isShow, setIsShow] = useState(true);

  const handleShow = () => {
    setIsShow(prev => !prev);
  };

  return (
    <FormControl isInvalid={meta.error && meta.touched} isRequired={props.isRequired}>
      <FormLabel>{props.label}</FormLabel>
      <VStack spacing={2} align="stretch">
        <InputGroup>
          <InputLeftAddon>{props.leftIcon}</InputLeftAddon>
          <Input
            {...field}
            value={value}
            type={props.type === 'password' ? (!isShow ? 'text' : 'password') : props.type}
            placeholder={props.placeholder ?? ''}
            autoComplete="off"
          />
          {props.rightIcon && props.hideIcon && (
            <InputRightAddon onClick={handleShow} cursor="pointer">
              {isShow ? props.rightIcon : props.hideIcon}
            </InputRightAddon>
          )}
          {props.rightIcon && !props.hideIcon && <InputRightAddon cursor="pointer">{props.rightIcon}</InputRightAddon>}
        </InputGroup>
        {props.type === 'password' && props.showStrengthBar === true && <PasswordStrengthBar password={value} className="pb-0" />}
      </VStack>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
}

export default AuthTextField;
