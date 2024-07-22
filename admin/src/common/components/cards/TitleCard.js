import { Box, Flex, Spacer } from '@chakra-ui/react';

import Subtitle from '../typography/Subtitle';

function TitleCard({ title, children, topMargin, TopSideButtons }) {
  return (
    <Box className={'card w-full mt-0 p-6 bg-base-100 shadow-xl' + (topMargin || 'mt-0')}>
      {/* Title for Card */}
      <Flex minWidth="max-content" alignItems="center" gap="2">
        <Flex gap={3}>
          <Box w="10px" bg="green.700" borderRadius="5px" />
          <Subtitle styleClass="text-left">{title} </Subtitle>
        </Flex>

        <Spacer />
        {/* Top side button, show only if present */}
        {TopSideButtons && <div className="inline-block float-right">{TopSideButtons}</div>}
      </Flex>

      <div className="divider mt-2" />

      {/* Card Body */}
      <div className="h-full w-full pb-6 bg-base-100">{children}</div>
    </Box>
  );
}

export default TitleCard;
