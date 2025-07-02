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

const EditProfile = () => {
  const [firstname, setFirstname] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const clearStates = () => {
    setFirstname("");
    setSurname("");
    setUsername("");
    setEmail("");
  };

  const hasChanges = () => {
    if (firstname || surname || username || email) return true;
    else return false;
  };

  const confirmBack = () => {
    if (hasChanges()) {
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
          {/* First Row - Firstname, Surname */}
          <View className="flex-row items-center w-full justify-between gap-3">
            <View className="flex-1 flex-col">
              <Text className="text-zinc-500 text-sm font-rRegular">
                First Name
              </Text>
              <TextInput
                placeholder="Jomari"
                placeholderTextColor={"#71717a"}
                value={firstname}
                onChangeText={setFirstname}
                className="border border-zinc-800 bg-light-black rounded-xl font-rRegular text-zinc-300 px-2"
              />
            </View>
            <View className="flex-1 flex-col">
              <Text className="text-zinc-500 text-sm font-rRegular">
                Surname
              </Text>
              <TextInput
                placeholder="Borines"
                placeholderTextColor={"#71717a"}
                value={surname}
                onChangeText={setSurname}
                className="border border-zinc-800 bg-light-black rounded-xl font-rRegular text-zinc-300 px-2"
              />
            </View>
          </View>

          {/* Username */}
          <View className="w-1/2 flex-col">
            <Text className="text-zinc-500 text-sm font-rRegular">
              Username
            </Text>
            <TextInput
              placeholder="chomi_b"
              placeholderTextColor={"#71717a"}
              value={username}
              onChangeText={setUsername}
              className="border border-zinc-800 bg-light-black rounded-xl font-rRegular text-zinc-300 px-2"
            />
          </View>

          {/* Email */}
          <View className="w-1/2 flex-col">
            <Text className="text-zinc-500 text-sm font-rRegular">Email</Text>
            <TextInput
              keyboardType="email-address"
              placeholder="jomari123@gmail.com"
              placeholderTextColor={"#71717a"}
              value={email}
              onChangeText={setEmail}
              className="border border-zinc-800 bg-light-black rounded-xl font-rRegular text-zinc-300 px-2"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={clearStates}
            className={`w-full rounded-xl justify-between items-center py-3 ${hasChanges() ? "bg-primary" : "bg-zinc-700"}`}
          >
            <Text
              className={`text-lg font-rBold ${hasChanges() ? "text-zinc-300" : "text-zinc-500"}`}
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
        Edit Profile
      </Text>
    </View>
  );
}

export default EditProfile;
