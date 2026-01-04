import { StyleSheet } from "react-native";
import { Text, VStack } from "@ending-credit/ui";

export default function Message() {
  return (
    <VStack
      style={styles.container}
      alignItems="center"
      justifyContent="center"
    >
      <Text variant="heading1" color="black">
        Message
      </Text>
    </VStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
