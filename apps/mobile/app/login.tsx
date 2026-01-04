import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { AppleLogin } from "../components/auth/AppleLogin";
import { GoogleLogin } from "../components/auth/GoogleLogin";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Login() {
  const { width } = useSafeAreaFrame();
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo-white.png")}
        style={{
          width: width / 2,
          aspectRatio: 1,
        }}
      />

      <View style={[styles.buttonContainer, { bottom: bottom + 16 }]}>
        <Text
          style={{
            color: "white",
            fontSize: 14,
            textAlign: "center",
            fontFamily: "Pretendard-Medium",
          }}
        >
          Record your cinematic journey!
        </Text>

        <GoogleLogin />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  buttonContainer: {
    position: "absolute",
    width: "100%",
    gap: 10,
  },
});
