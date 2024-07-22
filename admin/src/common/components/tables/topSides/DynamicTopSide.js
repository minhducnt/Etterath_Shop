import { Button, Flex, Stack, Tooltip } from '@chakra-ui/react';

import { AiOutlinePlusCircle, AiOutlineArrowLeft, AiOutlineSave } from 'react-icons/ai';

import { useNavigate } from 'react-router-dom';

import SearchBar from '../../field/SearchBar';

const DynamicTopSide = ({ setSearchText, onAddEditOpen, allowAddNew, showGoBack, showSave, type, disableBtn, loadingBtn }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);

    const typeKeyMap = {
      product: 'selectedProduct',
      productDetail: 'selectedProduct',
      orderProduct: 'selectedOrder',
      offerProduct: 'selectedOffer',
      categoryProduct: 'selectedCategory',
      categoryVariant: 'selectedCategory',
      categoryOption: 'selectedVariant',
      account: 'selectedAccount'
    };

    const keyToRemove = typeKeyMap[type];
    if (keyToRemove) {
      localStorage.removeItem(keyToRemove);
    }

    if (type === 'productDetail') {
      localStorage.removeItem('productProperties');
    }
  };

  return (
    <Flex align="center">
      <Stack direction="row" spacing={4}>
        {/* Searchbar */}
        {setSearchText && <SearchBar setSearchText={setSearchText} />}

        {/* Add New */}
        {allowAddNew && onAddEditOpen && (
          <Tooltip label="Add new record for table" hasArrow>
            <Button
              leftIcon={<AiOutlinePlusCircle size={18} className="mt-0.5" />}
              shadow="2xl"
              colorScheme="green"
              fontSize="md"
              w="120px"
              onClick={onAddEditOpen}
              isLoading={loadingBtn}
              isDisabled={disableBtn}
            >
              Add New
            </Button>
          </Tooltip>
        )}

        {showSave && (
          <Tooltip label="Save" hasArrow>
            <Button
              leftIcon={<AiOutlineSave size={18} className="mt-0.5" />}
              shadow="2xl"
              colorScheme="green"
              fontSize="md"
              w="120px"
              onClick={onAddEditOpen}
              isLoading={loadingBtn}
              isDisabled={disableBtn}
            >
              Save
            </Button>
          </Tooltip>
        )}

        {/* Go Back Button */}
        {showGoBack && (
          <Button leftIcon={<AiOutlineArrowLeft size={18} className="mt-0.5" />} onClick={handleBack} shadow="2xl" fontSize="md" w="120px">
            Go Back
          </Button>
        )}
      </Stack>
    </Flex>
  );
};

export default DynamicTopSide;
