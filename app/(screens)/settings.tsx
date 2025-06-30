import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import icons from "../../constants/icons";

const Settings = () => {
  return (
    <View className="flex-1 bg-backgroundColor">
      <Header />
    </View>
  );
};

function Header() {
  return (
    <View className="w-full flex-row justify-between items-center px-4 p-2 border-b border-b-zinc-800">
      <View className="flex-row gap-1 items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={icons.next}
            className="h-7 w-7 -scale-x-[1]"
            resizeMode="contain"
            tintColor={"#d4d4d8"}
          />
        </TouchableOpacity>
        <Text className="text-zinc-300 font-rBold text-2xl">Settings</Text>
      </View>
    </View>
  );
}

export default Settings;
