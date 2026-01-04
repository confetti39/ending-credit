import { StyleSheet, Text, View } from "react-native";
import { AppleLogin } from "../components/auth/AppleLogin";
import { GoogleLogin } from "../components/auth/GoogleLogin";

export default function Login() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ending Credit</Text>
      <View style={styles.buttonContainer}>
        <AppleLogin />
        <GoogleLogin />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50,
  },
  buttonContainer: {
    width: "100%",
    gap: 10,
  },
});
