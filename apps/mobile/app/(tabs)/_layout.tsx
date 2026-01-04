import { Tabs } from "expo-router";
import {
  Home,
  UserRound,
  Clapperboard,
  MessagesSquare,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "#e5e5e5",
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 5,
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "#888",
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "홈",
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          tabBarLabel: "기록",
          tabBarIcon: ({ color }) => <Clapperboard color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          tabBarLabel: "커뮤니티",
          tabBarIcon: ({ color }) => <MessagesSquare color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "프로필",
          tabBarIcon: ({ color }) => <UserRound color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
