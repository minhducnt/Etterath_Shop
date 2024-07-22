import { Avatar, Box } from '@chakra-ui/react';

import ModalImage from 'react-modal-image';

import React from 'react';

import onErrorImage from '../../../assets/images/onErrorImage.jpg';

function AvatarWithPreview(props) {
  const { src, alt, className, boxSize, altBoxSize, altSize, altRounded } = props;

  const handleOnError = e => {
    e.target.src = onErrorImage;
  };

  if (src && !src.includes('null')) {
    return (
      <Box boxSize={boxSize} display="flex" justifyContent="center" alignItems="center">
        <ModalImage
          className={`object-cover rounded-full ${className}`}
          small={src}
          large={src}
          alt={alt}
          showRotate={true}
          onError={handleOnError}
        />
      </Box>
    );
  } else {
    return <Avatar alt={alt} boxSize={altBoxSize} size={altSize} rounded={altRounded} />;
  }
}

export default AvatarWithPreview;
