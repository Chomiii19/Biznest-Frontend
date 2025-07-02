import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { Alert } from "react-native";

import React, { useState } from "react";
import { router } from "expo-router";
import icons from "../../constants/icons";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const clearStates = () => {
    Keyboard.dismiss();
    setPassword("");
  };

  const confirmBack = () => {
    if (password) {
      Alert.alert(
        "Discard changes?",
        "You have unsaved changes. If you go back now, your edits will be lost.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              clearStates();
              router.back();
            },
          },
        ],
      );
    } else {
      router.back();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 bg-backgroundColor">
        <Header confirmBack={confirmBack} />

        <View className="p-4 flex-col w-full gap-5">
          {/* Password */}
          <View className="w-full flex-col">
            <Text className="text-zinc-500 text-sm font-rRegular">
              Password
            </Text>
            <View className="w-full flex-row">
              <TextInput
                placeholder="*******"
                secureTextEntry={!showPassword}
                placeholderTextColor={"#71717a"}
                value={password}
                onChangeText={setPassword}
                className="border border-zinc-800 bg-light-black rounded-xl font-rRegular text-zinc-300 px-2 w-full"
              />
              <TouchableOpacity
                className="absolute right-4 self-center"
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Image
                  source={showPassword ? icons.eyeClose : icons.eye}
                  className="h-7 w-7 -scale-x-[1]"
                  resizeMode="contain"
                  tintColor={"#71717a"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={clearStates}
            className={`w-full rounded-xl justify-between items-center py-3 ${password ? "bg-primary" : "bg-zinc-700"}`}
          >
            <Text
              className={`text-lg font-rBold ${password ? "text-zinc-300" : "text-zinc-500"}`}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

function Header({ confirmBack }: { confirmBack: () => void }) {
  return (
    <View className="w-full flex-row items-center px-4 p-2 justify-center">
      <TouchableOpacity className="absolute left-4" onPress={confirmBack}>
        <Image
          source={icons.next}
          className="h-7 w-7 -scale-x-[1]"
          resizeMode="contain"
          tintColor={"#d4d4d8"}
        />
      </TouchableOpacity>

      <Text className="text-zinc-300 font-rBold text-2xl justify-self-center">
        Change Password
      </Text>
    </View>
  );
}

export default ChangePassword;
