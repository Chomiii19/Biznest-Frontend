import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import icons from "../../constants/icons";
import { router } from "expo-router";
import { TextInput } from "react-native-gesture-handler";

const CreatePost = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-backgroundColor">
        <Header />
        <View className="p-2 px-4 w-full flex-1">
          <TextInput
            textAlignVertical="top"
            scrollEnabled
            placeholderTextColor={"#71717a"}
            placeholder="Share details about your lot or rental unit..."
            className="w-full font-rRegular text-lg text-zinc-300"
          />
        </View>

        <View className="w-full flex-col">
          <TouchableOpacity className="flex-row gap-2 items-center border-y border-y-zinc-800 px-4 py-2">
            <Image
              source={icons["pin-fill"]}
              resizeMode="contain"
              className="h-7 w-7"
            />
            <Text className="text-zinc-500 font-rRegular text-lg">
              Select Location
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
        <Text className="text-zinc-300 font-rBold text-2xl">Create Post</Text>
      </View>

      <TouchableOpacity className="px-3 py-1 rounded-lg bg-primary">
        <Text className="text-zinc-300 font-rSemibold text-sm">Post</Text>
      </TouchableOpacity>
    </View>
  );
}

export default CreatePost;
