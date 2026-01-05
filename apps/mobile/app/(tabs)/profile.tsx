import {
  StyleSheet,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Text, VStack, HStack } from "@ending-credit/ui";
import { supabase } from "../../lib/supabase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { userApi } from "../../src/entities/user";
import { Profile as ProfileModel } from "../../src/entities/user/model";
import { Image } from "expo-image";

/**
 * Profile Tab
 */
export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileModel | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    try {
      const data = await userApi.getMyProfile();
      setProfile(data);
    } catch (e) {
      console.error("Failed to load profile", e);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <VStack
        style={styles.container}
        alignItems="center"
        justifyContent="center"
      >
        <ActivityIndicator size="large" />
      </VStack>
    );
  }

  return (
    <VStack
      style={styles.container}
      p={20}
      gap={20}
      alignItems="center"
      justifyContent="center"
    >
      <VStack alignItems="center" gap={10}>
        {profile?.profileImageUrl ? (
          <Image
            source={{ uri: profile.profileImageUrl }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        ) : (
          <VStack
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#e0e0e0",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text color="gray">No Image</Text>
          </VStack>
        )}
        <Text variant="heading2" color="black">
          {profile?.nickname || "Unknown User"}
        </Text>
      </VStack>

      <HStack gap={10}>
        <TouchableOpacity
          onPress={() => router.push("/setup-profile")}
          style={{
            backgroundColor: "#000",
            padding: 10,
            borderRadius: 8,
            minWidth: 100,
            alignItems: "center",
          }}
        >
          <Text color="white" style={{ fontWeight: "bold" }}>
            프로필 수정
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={signOut}
          style={{
            backgroundColor: "#ff4444",
            padding: 10,
            borderRadius: 8,
            minWidth: 100,
            alignItems: "center",
          }}
        >
          <Text color="white" style={{ fontWeight: "bold" }}>
            로그아웃
          </Text>
        </TouchableOpacity>
      </HStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
