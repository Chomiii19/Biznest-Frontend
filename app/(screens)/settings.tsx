import { View, Text, TouchableOpacity, Image, Switch } from "react-native";

import { PlatformPressable } from "@react-navigation/elements";
import React, { useState } from "react";
import { router } from "expo-router";
import icons from "../../constants/icons";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [appNotifications, setAppNotifications] = useState(false);
  const [messageAlerts, setMessageAlerts] = useState(false);
  const [postUpdates, setPostUpdates] = useState(false);
  const [evaluationAlerts, setEvaluationAlerts] = useState(false);

  const handleAppNotifications = () => {
    setAppNotifications((prev) => {
      const newValue = !prev;
      setMessageAlerts(newValue);
      setPostUpdates(newValue);
      setEvaluationAlerts(newValue);
      return newValue;
    });
  };

  return (
    <View className="flex-1 bg-backgroundColor">
      <Header />

      {/* Profile */}
      <View className="flex-col px-4 w-full mt-5">
        <Text className="text-zinc-300 font-rBold text-2xl justify-self-center">
          Account
        </Text>
        <View className="flex-col w-full border bg-light-black/80 rounded-xl">
          <PlatformPressable
            onPress={() => router.push("/editProfile")}
            className="px-4 py-2 flex-row justify-between border border-b-0 border-zinc-700 rounded-t-xl"
          >
            <Text className="text-zinc-300 font-rRegular">Edit Profile</Text>
            <Image
              source={icons.next}
              className="h-7 w-7"
              resizeMode="contain"
              tintColor={"#d4d4d8"}
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
              tintColor={"#d4d4d8"}
            />
          </PlatformPressable>
          <View className="px-4 py-2 flex-row justify-between border border-t-0 border-zinc-700 rounded-b-xl">
            <Text className="text-zinc-300 font-rRegular">Credits: 3</Text>
            <TouchableOpacity>
              <Text className="text-primary px-2 py-1 text-xs border border-primary rounded-lg font-rRegular">
                Buy Credits
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Preferences */}
      <View className="flex-col px-4 w-full mt-5">
        <Text className="text-zinc-300 font-rBold text-2xl justify-self-center">
          Preferences
        </Text>
        <View className="flex-col w-full border bg-light-black/80 rounded-xl">
          <View className="px-4 py-2 flex-row justify-between border border-b-0 border-zinc-700 rounded-t-xl">
            <Text className="text-zinc-300 font-rRegular">Dark Mode</Text>
            <Switch
              className="absolute right-2 -top-2 border border-zinc-100"
              trackColor={{ false: "#444", true: "#7862BF" }}
              thumbColor={darkMode ? "#7862BF" : "#ccc"}
              onValueChange={() => setDarkMode((prev) => !prev)}
              value={darkMode}
            />
          </View>
          <View className="px-4 py-2 flex-row justify-between border border-zinc-700">
            <Text className="text-zinc-300 font-rRegular">
              App Notifications
            </Text>
            <Switch
              className="absolute right-2 -top-2 border border-zinc-100"
              trackColor={{ false: "#444", true: "#7862BF" }}
              thumbColor={appNotifications ? "#7862BF" : "#ccc"}
              onValueChange={handleAppNotifications}
              value={appNotifications}
            />
          </View>
          <View className="px-4 py-2 flex-row justify-between border border-t-0 border-zinc-700">
            <Text
              className={`font-rRegular ${messageAlerts ? "text-zinc-300" : "text-zinc-500"}`}
            >
              Message Alerts
            </Text>
            <Switch
              className="absolute right-2 -top-2 border border-zinc-100"
              trackColor={{ false: "#444", true: "#7862BF" }}
              thumbColor={messageAlerts ? "#7862BF" : "#ccc"}
              onValueChange={() => {
                setMessageAlerts((prev) => !prev);
                setAppNotifications(true);
              }}
              value={messageAlerts}
            />
          </View>
          <View className="px-4 py-2 flex-row justify-between border border-t-0 border-zinc-700">
            <Text
              className={`font-rRegular ${postUpdates ? "text-zinc-300" : "text-zinc-500"}`}
            >
              Post Updates
            </Text>
            <Switch
              className="absolute right-2 -top-2 border border-zinc-100"
              trackColor={{ false: "#444", true: "#7862BF" }}
              thumbColor={postUpdates ? "#7862BF" : "#ccc"}
              onValueChange={() => {
                setPostUpdates((prev) => !prev);
                setAppNotifications(true);
              }}
              value={postUpdates}
            />
          </View>
          <View className="px-4 py-2 flex-row justify-between border border-t-0 border-zinc-700 rounded-b-xl">
            <Text
              className={`font-rRegular ${evaluationAlerts ? "text-zinc-300" : "text-zinc-500"}`}
            >
              Evaluation Alerts
            </Text>
            <Switch
              className="absolute right-2 -top-2 border border-zinc-100"
              trackColor={{ false: "#444", true: "#7862BF" }}
              thumbColor={evaluationAlerts ? "#7862BF" : "#ccc"}
              onValueChange={() => {
                setEvaluationAlerts((prev) => !prev);
                setAppNotifications(true);
              }}
              value={evaluationAlerts}
            />
          </View>
        </View>
      </View>

      {/* Others */}
      <View className="flex-col px-4 w-full mt-5">
        <Text className="text-zinc-300 font-rBold text-2xl justify-self-center">
          Others
        </Text>
        <View className="flex-col w-full border bg-light-black/80 rounded-xl">
          <PlatformPressable
            onPress={() => router.push("/FAQ")}
            className="px-4 py-2 flex-row justify-between border border-b-0 border-zinc-700 rounded-t-xl"
          >
            <Text className="text-zinc-300 font-rRegular">FAQ</Text>
            <Image
              source={icons.next}
              className="h-7 w-7"
              resizeMode="contain"
              tintColor={"#d4d4d8"}
            />
          </PlatformPressable>
          <PlatformPressable
            onPress={() => router.push("/contactUs")}
            className="px-4 py-2 flex-row justify-between border border-zinc-700"
          >
            <Text className="text-zinc-300 font-rRegular">Contact Us</Text>
            <Image
              source={icons.next}
              className="h-7 w-7"
              resizeMode="contain"
              tintColor={"#d4d4d8"}
            />
          </PlatformPressable>
          <PlatformPressable
            onPress={() => router.push("/feedback")}
            className="px-4 py-2 flex-row justify-between border border-t-0 border-zinc-700"
          >
            <Text className="text-zinc-300 font-rRegular">Feedback</Text>
            <Image
              source={icons.next}
              className="h-7 w-7"
              resizeMode="contain"
              tintColor={"#d4d4d8"}
            />
          </PlatformPressable>
          <PlatformPressable
            onPress={() => router.push("/reportIssue")}
            className="px-4 py-2 flex-row justify-between border border-t-0 border-zinc-700"
          >
            <Text className="text-zinc-300 font-rRegular">Report an Issue</Text>
            <Image
              source={icons.next}
              className="h-7 w-7"
              resizeMode="contain"
              tintColor={"#d4d4d8"}
            />
          </PlatformPressable>
          <PlatformPressable className="px-4 py-2 flex-row items-center pr-5 justify-between border border-t-0 border-zinc-700 rounded-b-xl">
            <Text className="text-red-500 font-rRegular">Log out</Text>
            <Image
              source={icons.logout}
              className="h-5 w-5"
              resizeMode="contain"
              tintColor={"#ef4444"}
            />
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
          tintColor={"#d4d4d8"}
        />
      </TouchableOpacity>

      <Text className="text-zinc-300 font-rBold text-2xl justify-self-center">
        Settings
      </Text>
    </View>
  );
}

export default Settings;
