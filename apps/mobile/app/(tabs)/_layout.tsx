import { Tabs } from "expo-router";
import { Home, Search, Bell, User } from "lucide-react-native";
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
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      {/* FIXME: 임시로 추가한 라우트 */}
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color }) => <Search color={color} size={24} />,
        }}
      />
      {/* FIXME: 임시로 추가한 라우트 */}
      <Tabs.Screen
        name="message"
        options={{
          tabBarLabel: "Message",
          tabBarIcon: ({ color }) => <Bell color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          tabBarLabel: "My Page",
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
