import { Tabs } from "expo-router";
import BottomTabBar from "../../components/BottomTabBar";
import { BottomSheetProvider } from "../../context/bottomSheetContext";

function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, animation: "shift" }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarLabel: "home" }}
      />
      <Tabs.Screen
        name="rents"
        options={{ title: "Rents", tabBarLabel: "rent" }}
      />
      <Tabs.Screen
        name="evaluate"
        options={{ title: "Evaluate", tabBarLabel: "locate" }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarLabel: "profile" }}
      />
    </Tabs>
  );
}

export default TabsLayout;
