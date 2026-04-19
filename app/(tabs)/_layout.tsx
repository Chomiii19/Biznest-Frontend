import { Tabs } from "expo-router";
import BottomTabBar from "../../components/BottomTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ animation: "shift" }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tabs.Screen
        name="evaluate"
        options={{
          title: "Evaluate",
          tabBarLabel: "locate",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "profile",
        }}
      />
    </Tabs>
  );
}
