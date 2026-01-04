import { Image } from "expo-image";
import { Text, VStack } from "@ending-credit/ui";
import { GoogleLogin } from "../components/auth/GoogleLogin";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Login() {
  const { width } = useSafeAreaFrame();
  const { bottom } = useSafeAreaInsets();

  return (
    <VStack
      flex={1}
      p={20}
      backgroundColor={"black"}
      alignItems="center"
      justifyContent="center"
    >
      <Image
        source={require("../assets/logo-white.png")}
        style={{
          width: width / 2,
          aspectRatio: 1,
        }}
      />

      <VStack position="absolute" bottom={bottom + 16} width="100%" gap={10}>
        <Text
          variant="body1"
          weight="medium"
          color="white"
          style={{ textAlign: "center" }}
        >
          Record your cinematic journey!
        </Text>

        <GoogleLogin />
      </VStack>
    </VStack>
  );
}
