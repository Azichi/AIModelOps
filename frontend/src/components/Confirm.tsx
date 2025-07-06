import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from '@chakra-ui/react';

export const useConfirm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let resolver: (ans: boolean) => void;

  const confirm = () =>
    new Promise<boolean>(res => {
      resolver = res;
      onOpen();
    });

  const ConfirmModal = ({ prompt }: { prompt: string }) => (
    <Modal isOpen={isOpen} onClose={() => { resolver(false); onClose(); }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{prompt}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Action cannot be undone.</ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={() => { resolver(false); onClose(); }}>
            Cancel
          </Button>
          <Button colorScheme='red' onClick={() => { resolver(true); onClose(); }}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return { confirm, ConfirmModal };
};
