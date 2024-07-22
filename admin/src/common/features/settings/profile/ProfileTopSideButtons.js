import { Button, Flex, Stack, Tooltip } from '@chakra-ui/react';

import { AiFillCheckCircle } from 'react-icons/ai';

const ProfileTopSideButtons = ({ onAddEditOpen }) => {
  return (
    <Flex align="center">
      <Stack direction="row" spacing={4}>
        <Tooltip label="Save" hasArrow>
          <Button
            leftIcon={<AiFillCheckCircle size={18} className="mt-0.5" />}
            shadow="2xl"
            colorScheme="green"
            fontSize="md"
            w="120px"
            onClick={onAddEditOpen}
          >
            Save
          </Button>
        </Tooltip>
      </Stack>
    </Flex>
  );
};

export default ProfileTopSideButtons;
