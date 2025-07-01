import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import icons from "../../constants/icons";
import { ScrollView } from "react-native-gesture-handler";

const Messages = () => {
  const [searchRecipient, setSearchRecipient] = useState("");

  return (
    <View className="flex-1 bg-backgroundColor">
      <Header />
      <ScrollView className="px-4 mt-2">
        <View className="absolute self-center top-3 w-full px-3 py-1 bg-zinc-700 rounded-full flex-row items-center elevation-lg border border-zinc-600">
          <Image
            source={icons.search}
            className="h-5 w-5 -scale-x-[1]"
            tintColor={"#848483"}
            resizeMode="contain"
          />
          <TextInput
            scrollEnabled
            placeholder="Search a location..."
            value={searchRecipient}
            onChangeText={setSearchRecipient}
            placeholderTextColor={"#848483"}
            className="flex-1 font-rRegular text-zinc-300 mx-2"
          />
          {searchRecipient && (
            <TouchableOpacity onPress={() => setSearchRecipient("")}>
              <Image
                source={icons.x}
                className="h-4 w-4"
                tintColor={"#848483"}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
        Messages
      </Text>
    </View>
  );
}

export default Messages;
