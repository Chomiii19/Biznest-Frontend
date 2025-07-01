import { View, Text, TouchableOpacity, Image } from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import React, { useState } from "react";
import { router } from "expo-router";
import icons from "../../constants/icons";
import { ScrollView } from "react-native-gesture-handler";
import SearchBar from "../../components/SearchBar";

const Messages = () => {
  const [searchRecipient, setSearchRecipient] = useState("");
  const handleSearchRecipient = async () => {};

  return (
    <View className="flex-1 bg-backgroundColor">
      <Header />
      <ScrollView className="px-4 mt-2">
        <SearchBar
          input={searchRecipient}
          setInput={setSearchRecipient}
          width="w-full"
          position="relative"
          handleSearchedInput={handleSearchRecipient}
          top="0"
        />

        <PlatformPressable className="w-full flex-row items-center px-3 py-4 justify-between bg-light-black rounded-2xl">
          <View className="flex-row items-center gap-3">
            <View className="bg-primary rounded-full justify-center items-center flex w-14 h-14">
              <Text className="font-rBold text-zinc-300 text-2xl">JB</Text>
            </View>

            <View className="flex-col  justify-self-start">
              <View className="flex-row gap-1 items-center">
                <Text className="text-lg font-rRegular text-zinc-300">
                  chomi_b
                </Text>
                <Text className="text-xs font-rRegular text-zinc-500">
                  2 minute ago
                </Text>
              </View>
              <Text className="text-sm font-rRegular text-zinc-300">
                skdksdkkdhshdkshdkhkhskhdk
              </Text>
            </View>
          </View>
        </PlatformPressable>
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
