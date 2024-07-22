import { Box, Image } from '@chakra-ui/react';

import ModalImage from 'react-modal-image';

import React from 'react';

import onErrorImage from '../../../assets/images/onErrorItem.png';

function ItemWithPreview(props) {
  const { src, alt, className, boxSize, altBoxSize, altSize, altRounded } = props;

  const handleOnError = e => {
    e.target.src = onErrorImage;
  };

  if (!src && !src.includes('etterath-shop_')) {
    return (
      <Box
        display="flex"
        bg={'#D9E3E5'}
        borderRadius="full"
        boxSize={altBoxSize}
        alignItems="center"
        justifyContent="center"
        objectFit="contain"
      >
        <Image alt={alt} boxSize="30px" rounded={altRounded} size={altSize} src={onErrorImage} />
      </Box>
    );
  }

  return (
    <Box boxSize={boxSize} display="flex" justifyContent="center" alignItems="center" borderRadius="full">
      <ModalImage
        className={`object-cover rounded-full ${className}`}
        small={src}
        medium={src}
        large={src}
        alt={alt}
        showRotate={true}
        onError={handleOnError}
      />
    </Box>
  );
}

export default ItemWithPreview;
