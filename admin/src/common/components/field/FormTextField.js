import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  Textarea
} from '@chakra-ui/react';

import { Field, useField } from 'formik';

import { useState } from 'react';

import RadioGenderField from '../field/RadioGenderField';

import AddressSelection from './AddressSelection';
import CurrencyField from './CurrencyField';
import CustomSelection from './CustomSelection';
import ImageUploadField from './ImageUploadField';
import MultiSelection from './MultiSelection';
import NumberField from './NumberField';
import QuillInput from './QuillInput';

function FormTextField(props) {
  const {
    arrayGender,
    formik,
    handleOnChange,
    height,
    hidden,
    hideIcon,
    isAddress,
    isCustomSelectionField,
    isDateField,
    isDisabled,
    isGender,
    isMultiSelection,
    isNumber,
    isCurrency,
    isPassword,
    isReadOnly,
    isRequired,
    isResize,
    isQuill,
    isSelectionField,
    isTextAreaField,
    isTimeField,
    isImgUpload,
    isMultiImgUpload,
    label,
    leftIcon,
    onChanged,
    placeholder,
    rightIcon,
    selectionArray,
    size,
    type
  } = props;

  const [field, meta] = useField(props);
  const [isShow, setIsShow] = useState(true);

  const handleShow = () => {
    setIsShow(prev => !prev);
  };

  if (hidden) {
    return null;
  }

  if (isDateField) {
    return (
      <FormControl
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        isDisabled={isDisabled}
        isInvalid={meta.error && meta.touched}
        onChange={e => {
          if (handleOnChange) {
            handleOnChange(e.target.value);
          }
        }}
      >
        {label && <FormLabel>{label}</FormLabel>}
        <InputGroup>
          <Input {...field} type={type ?? 'date'} bg={isReadOnly ? '#f9f9f9' : 'white'} />
        </InputGroup>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else if (isTimeField) {
    return (
      <FormControl isReadOnly={isReadOnly} isRequired={isRequired} isDisabled={isDisabled} isInvalid={meta.error && meta.touched}>
        {label && <FormLabel>{label}</FormLabel>}
        <InputGroup>
          <Input {...field} type={type ?? 'time'} bg={isReadOnly ? '#f9f9f9' : 'white'} />
        </InputGroup>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else if (isTextAreaField) {
    return (
      <FormControl isReadOnly={isReadOnly} isRequired={isRequired} isDisabled={isDisabled} isInvalid={meta.error && meta.touched}>
        {label && <FormLabel>{label}</FormLabel>}
        <Textarea
          {...field}
          resize={isResize ?? 'none'}
          height={height ?? 'none'}
          size={size ?? 'md'}
          placeholder={placeholder ?? ''}
          rows={4}
          bg={isReadOnly ? '#f9f9f9' : 'white'}
        />
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else if (isGender) {
    return (
      <FormControl my={3} isReadOnly={isReadOnly} isRequired={isRequired} isDisabled={isDisabled} isInvalid={meta.error && meta.touched}>
        {label && <FormLabel>{label}</FormLabel>}
        <Field
          {...field}
          arrayGender={arrayGender}
          as={RadioGenderField}
          onChange={e => {
            formik.setFieldValue('gender', e);
          }}
          onBlur={formik.handleBlur}
        />
      </FormControl>
    );
  } else if (isSelectionField) {
    return (
      <FormControl isReadOnly={isReadOnly} isRequired={isRequired} isDisabled={isDisabled} isInvalid={meta.error && meta.touched}>
        {label && <FormLabel>{label}</FormLabel>}
        <>
          <Select pointerEvents={isReadOnly ? 'none' : ''} {...field} placeholder={placeholder ?? ''} bg={isReadOnly ? '#f9f9f9' : 'white'}>
            {selectionArray &&
              selectionArray.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
          </Select>
        </>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else if (isCustomSelectionField) {
    return (
      <FormControl isRequired={isRequired} isDisabled={isDisabled} isInvalid={meta.error && meta.touched}>
        {label && <FormLabel>{label}</FormLabel>}
        <Field
          {...field}
          formik={formik}
          placeholder={placeholder}
          selectionArray={selectionArray}
          as={CustomSelection}
          isReadOnly={isReadOnly}
          onChange={e => onChanged && onChanged(e)}
        />
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else if (isMultiSelection) {
    return (
      <FormControl isReadOnly={isReadOnly} isRequired={isRequired} isDisabled={isDisabled} isInvalid={meta.error && meta.touched}>
        {label && <FormLabel>{label}</FormLabel>}
        <Field
          {...field}
          formik={formik}
          placeholder={placeholder}
          selectionArray={selectionArray}
          as={MultiSelection}
          isReadOnly={isReadOnly}
          onChange={e => onChanged && onChanged(e)}
        />
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else if (isAddress) {
    return (
      <FormControl isReadOnly={isReadOnly} isRequired={isRequired} isDisabled={isDisabled} isInvalid={meta.error && meta.touched}>
        {label && <FormLabel>{label}</FormLabel>}
        <Field {...field} isDisabled={isDisabled} isReadOnly={isReadOnly} isRequired={isRequired} formik={formik} as={AddressSelection} />
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else if (isPassword) {
    return (
      <FormControl isReadOnly={isReadOnly} isRequired={isRequired} isDisabled={isDisabled} isInvalid={meta.error && meta.touched}>
        <FormLabel>{label}</FormLabel>
        <InputGroup>
          {leftIcon && <InputLeftElement pl={2} children={leftIcon} />}
          {rightIcon && hideIcon && <InputRightElement onClick={handleShow} cursor="pointer" children={isShow ? rightIcon : hideIcon} />}
          {rightIcon && !hideIcon && <InputRightElement cursor="pointer" children={rightIcon} />}
          <Input {...field} type={!isShow ? 'text' : 'password'} placeholder={placeholder ?? ''} />
        </InputGroup>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else if (isQuill) {
    return (
      <FormControl isRequired={isRequired} isDisabled={isDisabled} isInvalid={meta.error && meta.touched}>
        {label && <FormLabel>{label}</FormLabel>}
        <Field {...field} formik={formik} as={QuillInput} isReadOnly={isReadOnly} height={height ?? 'none'} />
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else if (isNumber) {
    return (
      <FormControl isReadOnly={isReadOnly} isRequired={isRequired} isDisabled={isDisabled} isInvalid={meta.error && meta.touched}>
        <FormLabel>{label}</FormLabel>
        <Field {...field} formik={formik} as={NumberField} isReadOnly={isReadOnly} />
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else if (isCurrency) {
    return (
      <FormControl isReadOnly={isReadOnly} isRequired={isRequired} isDisabled={isDisabled} isInvalid={meta.error && meta.touched}>
        <FormLabel>{label}</FormLabel>
        <Field {...field} formik={formik} as={CurrencyField} isReadOnly={isReadOnly} />
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else if (isImgUpload || isMultiImgUpload) {
    return (
      <FormControl isReadOnly={isReadOnly} isRequired={isRequired} isDisabled={isDisabled} isInvalid={meta.error && meta.touched}>
        <FormLabel>{label}</FormLabel>
        <Field {...field} formik={formik} as={ImageUploadField} isReadOnly={isReadOnly} />
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else {
    return (
      <FormControl isReadOnly={isReadOnly} isRequired={isRequired} isDisabled={isDisabled} isInvalid={meta.error && meta.touched}>
        {label && <FormLabel>{label}</FormLabel>}
        <InputGroup>
          {leftIcon && <InputLeftElement pl={2} children={leftIcon} />}
          {rightIcon && <InputRightElement pr={2} children={rightIcon} />}
          <Input
            {...field}
            value={field.value || ''}
            type={type ?? 'text'}
            placeholder={placeholder ?? ''}
            bg={isReadOnly ? '#f9f9f9' : 'white'}
          />
        </InputGroup>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  }
}

export default FormTextField;
