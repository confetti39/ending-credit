import React, { useEffect, useState } from "react";
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
import { ProfileUpdateParams, userApi } from "../../../entities/user";
import { VStack } from "@ending-credit/ui";
import { useRouter } from "expo-router";
import { useForm } from "@tanstack/react-form";

type FormType = Pick<ProfileUpdateParams, "nickname" | "profileImageUrl"> & {
  localImageUri?: string;
};

const defaultValues: FormType = {
  nickname: "",
  profileImageUrl: undefined,
  localImageUri: undefined,
};

export function ProfileSetupForm() {
  const router = useRouter();

  // FIXME: API 개발 후 useQuery 로 수정하기.
  const [initialLoading, setInitialLoading] = useState(true);
  const [originalNickname, setOriginalNickname] = useState<string | null>(null);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        let uploadedUrl = value.profileImageUrl;

        if (value.localImageUri) {
          uploadedUrl = await userApi.uploadProfileImage(value.localImageUri);
        }

        await userApi.updateMyProfile({
          nickname: value.nickname,
          profileImageUrl: uploadedUrl,
          bio: "",
        });

        Alert.alert("성공", "프로필이 저장되었습니다.");
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/(tabs)");
        }
      } catch (e: any) {
        Alert.alert("오류", e.message);
        console.error(e);
      }
    },
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await userApi.getMyProfile();
      if (profile) {
        form.setFieldValue("nickname", profile.nickname);
        form.setFieldValue("profileImageUrl", profile.profileImageUrl);
        setOriginalNickname(profile.nickname);
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
      form.setFieldValue("localImageUri", result.assets[0].uri);
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
      <form.Field
        name="localImageUri"
        children={(localImageField) => (
          <form.Field
            name="profileImageUrl"
            children={(remoteImageField) => (
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity onPress={pickImage}>
                  {localImageField.state.value ||
                  remoteImageField.state.value ? (
                    <Image
                      source={{
                        uri:
                          localImageField.state.value ||
                          remoteImageField.state.value ||
                          undefined,
                      }}
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
            )}
          />
        )}
      />

      <form.Field
        name="nickname"
        validators={{
          onChange: ({ value }) => {
            if (value == null) {
              return "닉네임은 필수 입력입니다.";
            }

            if (value.length < 2) {
              return "닉네임은 2글자 이상이어야 합니다.";
            }

            return;
          },
          onChangeAsyncDebounceMs: 500,
          onChangeAsync: async ({ value }) => {
            if (value === originalNickname) {
              return;
            }

            if (value == null) {
              return "닉네임은 필수 입력입니다.";
            }

            if (value.length < 2) {
              return "닉네임은 2글자 이상이어야 합니다.";
            }

            try {
              const available = await userApi.checkNicknameAvailability(value);
              return available ? undefined : "이미 사용 중인 닉네임입니다.";
            } catch (e) {
              console.error(e);
              return "중복 확인 실패";
            }
          },
        }}
        children={(field) => (
          <VStack gap={8}>
            <Text style={{ fontSize: 14, fontWeight: "600" }}>닉네임</Text>
            <TextInput
              value={field.state.value}
              onChangeText={(text) => field.handleChange(text)}
              onBlur={field.handleBlur}
              placeholder="사용할 닉네임을 입력하세요"
              style={{
                borderWidth: 1,
                borderColor:
                  field.state.meta.errors.length > 0 ? "red" : "#e0e0e0",
                padding: 12,
                borderRadius: 8,
              }}
              autoCapitalize="none"
            />
            {field.state.meta.isValidating && (
              <Text style={{ fontSize: 12, color: "#999" }}>
                중복 확인 중...
              </Text>
            )}
            {!field.state.meta.isValidating &&
              field.state.meta.errors.length > 0 && (
                <Text style={{ fontSize: 12, color: "red" }}>
                  {field.state.meta.errors.join(", ")}
                </Text>
              )}
            {!field.state.meta.isValidating &&
              field.state.meta.isTouched &&
              field.state.meta.errors.length === 0 && (
                <Text style={{ fontSize: 12, color: "green" }}>
                  사용 가능한 닉네임입니다.
                </Text>
              )}
          </VStack>
        )}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <TouchableOpacity
            onPress={form.handleSubmit}
            disabled={!canSubmit || isSubmitting}
            style={{
              backgroundColor: !canSubmit || isSubmitting ? "#ccc" : "#000",
              padding: 16,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: "white", fontWeight: "bold" }}>
                저장하기
              </Text>
            )}
          </TouchableOpacity>
        )}
      />
    </VStack>
  );
}
