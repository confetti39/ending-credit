import { StyleSheet, Text, View, Button } from "react-native";
import { supabase } from "../lib/supabase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function Index() {
  const signOut = async () => {
    try {
      // 1. 구글 세션 종료 시도 (최선 노력)
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // 구글로 로그인하지 않았거나 SDK가 초기화되지 않은 경우 에러 무시
        // 애플 로그인이나 이메일 로그인 유저가 멈추지 않도록 함
      }

      // 2. Supabase 세션 종료 (필수)
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // 로그인 화면으로의 이동은 _layout.tsx의 인증 리스너가 자동으로 처리함
    } catch (error) {
      console.error("Error signing out:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to Ending Credit!</Text>
      <View style={{ marginTop: 20 }}>
        <Button title="Logout" onPress={signOut} />
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
  },
});
