import React from "react";
import { View, SafeAreaView } from "react-native";
import { Text } from "@ending-credit/ui";
import { ProfileSetupForm } from "../../features/profile-setup/ui/ProfileSetupForm";

export default function ProfileSetupPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, alignItems: "center", paddingTop: 60 }}>
        <Text variant="heading2" style={{ marginBottom: 40 }}>
          프로필 설정
        </Text>
        <ProfileSetupForm />
      </View>
    </SafeAreaView>
  );
}
