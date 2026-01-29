import { Box, BoxProps } from "@chakra-ui/react";

export function PanelCard(props: BoxProps) {
  return (
    <Box
      bg="var(--surface)"
      border="1px solid var(--border)"
      borderRadius="12px"
      p={5}
      {...props}
    />
  );
}

