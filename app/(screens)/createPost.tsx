import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import icons from "../../constants/icons";
import { router } from "expo-router";
import { TextInput } from "react-native-gesture-handler";
import ImageResolution from "../../components/ImageResolution";

const CreatePost = () => {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

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
          {image && (
            <View className="w-full">
              <ImageResolution image={image} />
              <TouchableOpacity
                onPress={() => setImage(null)}
                className="bg-lighter-black rounded-full p-2 absolute -top-1 right-3"
              >
                <Image
                  className="h-5 w-5"
                  tintColor={"#71717a"}
                  resizeMode="contain"
                  source={icons.x}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="w-full flex-col">
          <TouchableOpacity className="flex-row gap-3 items-center border-y border-y-zinc-800 px-4 py-2">
            <Image
              source={icons["pin-fill"]}
              resizeMode="contain"
              className="h-7 w-7"
            />
            <Text className="text-zinc-500 font-rRegular text-lg">
              Select Location
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={pickImage}
            className="flex-row gap-3 items-center border-y border-y-zinc-800 px-4 py-2"
          >
            <Image
              source={icons.camera}
              resizeMode="contain"
              className="h-7 w-7"
            />
            <Text className="text-zinc-500 font-rRegular text-lg">
              Insert Images/Videos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row gap-3 items-center border-y border-y-zinc-800 px-4 py-2">
            <Image
              source={icons.cash}
              resizeMode="contain"
              className="h-8 w-8"
            />
            <Text className="text-zinc-500 font-rRegular text-lg">
              Set Price
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row gap-3 items-center border-y border-y-zinc-800 px-4 py-2">
            <Image
              source={icons.evaluate}
              resizeMode="contain"
              className="h-7 w-7"
            />
            <Text className="text-zinc-500 font-rRegular text-lg">
              Evaluate Location
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
