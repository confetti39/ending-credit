import {
  GoogleSignin,
  GoogleSigninButton,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "../../lib/supabase";

GoogleSignin.configure({
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
});

export function GoogleLogin() {
  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const response = await GoogleSignin.signIn();
          if (isSuccessResponse(response) && response.data.idToken != null) {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: response.data.idToken,
            });
            console.log(error, data);

            if (error) {
              throw error;
            }
          }
        } catch (error: any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // 사용자가 로그인 흐름을 취소함
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // 이미 로그인 작업이 진행 중임
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // Google Play 서비스를 사용할 수 없거나 업데이트가 필요함
          } else {
            // 그 외 알 수 없는 에러 발생
            console.error("Google Login Error:", error);
          }
        }
      }}
    />
  );
}
