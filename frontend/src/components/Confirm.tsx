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
      <ModalOverlay bg="rgba(0,0,0,0.55)" />
      <ModalContent bg="var(--surface)" color="var(--textPrimary)" border="1px solid var(--border)">
        <ModalHeader>{prompt}</ModalHeader>
        <ModalCloseButton />
        <ModalBody color="var(--textMuted)">Action cannot be undone.</ModalBody>
        <ModalFooter>
          <Button
            mr={3}
            variant="subtle"
            onClick={() => { resolver(false); onClose(); }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => { resolver(true); onClose(); }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return { confirm, ConfirmModal };
};
