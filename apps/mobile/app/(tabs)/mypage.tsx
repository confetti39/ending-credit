import { StyleSheet, Button } from "react-native";
import { Text, VStack } from "@ending-credit/ui";
import { supabase } from "../../lib/supabase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function MyPage() {
  const signOut = async () => {
    try {
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // Ignore error
      }
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <VStack
      style={styles.container}
      p={20}
      gap={20}
      alignItems="center"
      justifyContent="center"
    >
      <Text variant="heading2" color="black">
        My Page
      </Text>
      <Button title="Logout" onPress={signOut} />
    </VStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
