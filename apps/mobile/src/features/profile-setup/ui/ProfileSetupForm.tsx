import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { userApi } from "../../../entities/user"; // Relative import based on FSD
import { VStack, HStack } from "@ending-credit/ui"; // Assuming these exist
import { useRouter } from "expo-router";

export function ProfileSetupForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(
    null
  );
  const [originalNickname, setOriginalNickname] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await userApi.getMyProfile();
      if (profile) {
        setNickname(profile.nickname);
        setOriginalNickname(profile.nickname);
        setImageUrl(profile.profileImageUrl);
        // 기존 닉네임은 사용 가능한 것으로 간주
        setNicknameAvailable(true);
      }
    } catch (e) {
      console.error("Failed to load profile", e);
    } finally {
      setInitialLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setLocalImageUri(result.assets[0].uri);
    }
  };

  const checkNickname = async (text: string) => {
    setNickname(text);
    if (text.length < 2) {
      setNicknameAvailable(null);
      return;
    }

    // 원래 내 닉네임과 같으면 중복 체크 패스
    if (text === originalNickname) {
      setNicknameAvailable(true);
      return;
    }

    setCheckingNickname(true);
    try {
      const available = await userApi.checkNicknameAvailability(text);
      setNicknameAvailable(available);
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingNickname(false);
    }
  };

  const handleSubmit = async () => {
    if (!nicknameAvailable) return;
    setLoading(true);
    try {
      let uploadedUrl = imageUrl;
      if (localImageUri) {
        uploadedUrl = await userApi.uploadProfileImage(localImageUri);
      }

      await userApi.updateMyProfile({
        nickname,
        profileImageUrl: uploadedUrl,
        bio: "", // Default empty bio or keep existing? API limits currently
      });

      Alert.alert("성공", "프로필이 저장되었습니다.");
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)");
      }
    } catch (e: any) {
      Alert.alert("오류", e.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <VStack gap={24} style={{ width: "100%", paddingHorizontal: 24 }}>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity onPress={pickImage}>
          {localImageUri || imageUrl ? (
            <Image
              source={{ uri: localImageUri || imageUrl || undefined }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          ) : (
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "#e0e0e0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#757575" }}>사진 선택</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <VStack gap={8}>
        <Text style={{ fontSize: 14, fontWeight: "600" }}>닉네임</Text>
        <TextInput
          value={nickname}
          onChangeText={checkNickname}
          placeholder="사용할 닉네임을 입력하세요"
          style={{
            borderWidth: 1,
            borderColor: nicknameAvailable === false ? "red" : "#e0e0e0",
            padding: 12,
            borderRadius: 8,
          }}
          autoCapitalize="none"
        />
        {checkingNickname && (
          <Text style={{ fontSize: 12, color: "#999" }}>중복 확인 중...</Text>
        )}
        {nicknameAvailable === true && (
          <Text style={{ fontSize: 12, color: "green" }}>
            사용 가능한 닉네임입니다.
          </Text>
        )}
        {nicknameAvailable === false && (
          <Text style={{ fontSize: 12, color: "red" }}>
            이미 사용 중인 닉네임입니다.
          </Text>
        )}
      </VStack>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={!nicknameAvailable || loading}
        style={{
          backgroundColor: !nicknameAvailable || loading ? "#ccc" : "#000",
          padding: 16,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", fontWeight: "bold" }}>저장하기</Text>
        )}
      </TouchableOpacity>
    </VStack>
  );
}
