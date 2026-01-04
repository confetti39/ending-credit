import { StyleSheet } from "react-native";
import { Text, VStack } from "@ending-credit/ui";

/**
 * Home Tab
 */
export default function Index() {
  return (
    <VStack
      style={styles.container}
      alignItems="center"
      justifyContent="center"
    >
      <Text variant="heading1" color="black">
        Home
      </Text>
      <Text variant="body1" color="gray">
        Welcome to Ending Credit!
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
