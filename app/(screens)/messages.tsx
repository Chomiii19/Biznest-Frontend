import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
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
        <View className="w-full">
          <SearchBar
            input={searchRecipient}
            setInput={setSearchRecipient}
            width="w-full"
            position=""
            handleSearchedInput={handleSearchRecipient}
          />
        </View>

        <View className="w-full flex-row items-center px-3 py-1 justify-between">
          <View className="flex-row items-center gap-3">
            <View className="bg-primary rounded-full justify-center items-center flex w-36 h-36">
              <Text className="font-rBold text-zinc-300 text-2xl">JB</Text>
            </View>

            <View></View>
          </View>
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
