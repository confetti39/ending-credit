import { useEffect, useState, useCallback } from "react";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Session } from "@supabase/supabase-js";
import { View, ActivityIndicator } from "react-native";
import { supabase } from "../lib/supabase";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
});

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "Pretendard-Regular": require("../assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-Medium": require("../assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-Bold": require("../assets/fonts/Pretendard-Bold.otf"),
  });

  useEffect(() => {
    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setAuthInitialized(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authInitialized || !fontsLoaded) return;

    const inLoginScreen = segments[0] === "login";

    if (session && inLoginScreen) {
      router.replace("/");
    } else if (!session && !inLoginScreen) {
      router.replace("/login");
    }
  }, [session, authInitialized, fontsLoaded, segments]);

  const onLayoutRootView = useCallback(async () => {
    if (authInitialized && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [authInitialized, fontsLoaded]);

  if (!authInitialized || !fontsLoaded) {
    return null;
  }

  // 세션이 없는데 로그인 화면이 아니라면, 내용을 렌더링하지 않고 리다이렉트를 기다림 (FOUC 방지)
  const inLoginScreen = segments[0] === "login";
  if (!session && !inLoginScreen) {
    return <View style={{ flex: 1, backgroundColor: "black" }} />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
}
