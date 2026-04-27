import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import icons from "../../constants/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "user_settings";

interface ISettings {
  darkMode: boolean;
  appNotifications: boolean;
  messageAlerts: boolean;
  postUpdates: boolean;
  evaluationAlerts: boolean;
}

const DEFAULT_SETTINGS: ISettings = {
  darkMode: false,
  appNotifications: false,
  messageAlerts: false,
  postUpdates: false,
  evaluationAlerts: false,
};

const Settings = () => {
  const [settings, setSettings] = useState<ISettings>(DEFAULT_SETTINGS);
  const [logingOut, setLogingOut] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((raw) => {
      if (raw) setSettings(JSON.parse(raw));
    });
  }, []);

  // Persist whenever settings change
  const updateSettings = (patch: Partial<ISettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleAppNotifications = () => {
    const newValue = !settings.appNotifications;
    updateSettings({
      appNotifications: newValue,
      messageAlerts: newValue,
      postUpdates: newValue,
      evaluationAlerts: newValue,
    });
  };

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          setLogingOut(true);
          await AsyncStorage.removeItem("token");
          router.replace("/(auth)");
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-backgroundColor">
      <Header />

      {/* Account */}
      <View className="flex-col px-4 w-full mt-5">
        <Text className="text-zinc-300 font-rBold text-2xl">Account</Text>
        <View className="flex-col w-full border bg-light-black/80 rounded-xl mt-1">
          <PlatformPressable
            onPress={() => router.push("/editProfile")}
            className="px-4 py-2 flex-row justify-between border border-b-0 border-zinc-700 rounded-t-xl"
          >
            <Text className="text-zinc-300 font-rRegular">Edit Profile</Text>
            <Image
              source={icons.next}
              className="h-7 w-7"
              resizeMode="contain"
              tintColor="#d4d4d8"
            />
          </PlatformPressable>
          <PlatformPressable
            onPress={() => router.push("/changePassword")}
            className="px-4 py-2 flex-row justify-between border border-zinc-700"
          >
            <Text className="text-zinc-300 font-rRegular">Change Password</Text>
            <Image
              source={icons.next}
              className="h-7 w-7"
              resizeMode="contain"
              tintColor="#d4d4d8"
            />
          </PlatformPressable>
        </View>
      </View>

      {/* Preferences */}
      <View className="flex-col px-4 w-full mt-5">
        <Text className="text-zinc-300 font-rBold text-2xl">Preferences</Text>
        <View className="flex-col w-full border bg-light-black/80 rounded-xl mt-1">
          <SettingRow
            label="App Notifications"
            value={settings.appNotifications}
            onToggle={handleAppNotifications}
            isFirst
          />
          <SettingRow
            label="Message Alerts"
            value={settings.messageAlerts}
            dimmed={!settings.messageAlerts}
            onToggle={() =>
              updateSettings({
                messageAlerts: !settings.messageAlerts,
                appNotifications: true,
              })
            }
          />
          <SettingRow
            label="Post Updates"
            value={settings.postUpdates}
            dimmed={!settings.postUpdates}
            onToggle={() =>
              updateSettings({
                postUpdates: !settings.postUpdates,
                appNotifications: true,
              })
            }
          />
          <SettingRow
            label="Evaluation Alerts"
            value={settings.evaluationAlerts}
            dimmed={!settings.evaluationAlerts}
            onToggle={() =>
              updateSettings({
                evaluationAlerts: !settings.evaluationAlerts,
                appNotifications: true,
              })
            }
            isLast
          />
        </View>
      </View>

      {/* Others */}
      <View className="flex-col px-4 w-full mt-5">
        <Text className="text-zinc-300 font-rBold text-2xl">Others</Text>
        <View className="flex-col w-full border bg-light-black/80 rounded-xl mt-1">
          <PlatformPressable
            onPress={() => router.push("/FAQ")}
            className="px-4 py-2 flex-row justify-between border border-b-0 border-zinc-700 rounded-t-xl"
          >
            <Text className="text-zinc-300 font-rRegular">FAQ</Text>
            <Image
              source={icons.next}
              className="h-7 w-7"
              resizeMode="contain"
              tintColor="#d4d4d8"
            />
          </PlatformPressable>

          <PlatformPressable
            onPress={handleLogout}
            disabled={logingOut}
            className="px-4 py-2 flex-row items-center pr-5 justify-between border border-t-0 border-zinc-700 rounded-b-xl"
          >
            {logingOut ? (
              <ActivityIndicator color="#ef4444" />
            ) : (
              <>
                <Text className="text-red-500 font-rRegular">Log out</Text>
                <Image
                  source={icons.logout}
                  className="h-5 w-5"
                  resizeMode="contain"
                  tintColor="#ef4444"
                />
              </>
            )}
          </PlatformPressable>
        </View>
      </View>

      {/* Footer */}
      <View className="items-center mt-3">
        <Text className="text-xs text-zinc-600">Biznest v1.0.0</Text>
        <Text className="text-xs text-zinc-600">© 2025 Biznest Team</Text>
      </View>
    </View>
  );
};

function SettingRow({
  label,
  value,
  onToggle,
  dimmed = false,
  isFirst = false,
  isLast = false,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
  dimmed?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <View
      className={`px-4 flex-row justify-between items-center border border-zinc-700
        ${isFirst ? "rounded-t-xl border-b-0" : ""}
        ${isLast ? "rounded-b-xl border-t-0" : "border-t-0"}
      `}
    >
      <Text
        className={`font-rRegular ${dimmed ? "text-zinc-500" : "text-zinc-300"}`}
      >
        {label}
      </Text>
      <Switch
        trackColor={{ false: "#444", true: "#7862BF" }}
        thumbColor={value ? "#7862BF" : "#ccc"}
        onValueChange={onToggle}
        value={value}
      />
    </View>
  );
}

function Header() {
  return (
    <View className="w-full flex-row items-center px-4 p-2 justify-center">
      <TouchableOpacity
        className="absolute left-4"
        onPress={() => router.back()}
      >
        <Image
          source={icons.next}
          className="h-7 w-7 -scale-x-[1]"
          resizeMode="contain"
          tintColor="#d4d4d8"
        />
      </TouchableOpacity>
      <Text className="text-zinc-300 font-rBold text-2xl">Settings</Text>
    </View>
  );
}

export default Settings;
