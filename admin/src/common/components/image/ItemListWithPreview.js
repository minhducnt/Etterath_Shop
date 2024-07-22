import { Image, Box } from '@chakra-ui/react';

import { LightboxGalleryWithImages } from '@didik-mulyadi/react-modal-images';

import React from 'react';

import onErrorImage from '../../../assets/images/onErrorItem.png';

function ItemListWithPreview(props) {
  const { src, alt, className, boxSize, altBoxSize, altSize, altRounded } = props;

  const handleOnError = e => {
    e.target.src = onErrorImage;
  };

  const convertedImages = src.map((url, index) => ({
    id: index,
    src: url,
    fileName: url
  }));

  if ((!src && !src.includes('etterath-shop_')) || !src) {
    return (
      <Box
        alignItems="center"
        bg={'#D9E3E5'}
        borderRadius="full"
        boxSize={boxSize}
        display="flex"
        justifyContent="center"
        objectFit="contain"
      >
        <Image
          alt={alt}
          boxSize={altBoxSize}
          rounded={altRounded}
          size={altSize}
          src={onErrorImage}
          style={{
            objectFit: 'contain',
            width: '100%',
            height: 'auto'
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      boxSize={boxSize}
      display="flex"
      overflowX="auto"
      className="pt-2 pb-2"
      css={{
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}
    >
      <LightboxGalleryWithImages
        className={`object-cover rounded-full ${className}`}
        images={convertedImages}
        hideDownload={true}
        showRotate={true}
        onError={handleOnError}
      />
    </Box>
  );
}

export default ItemListWithPreview;
