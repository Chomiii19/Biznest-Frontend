import {
  View,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import React, { useState } from "react";
import { router } from "expo-router";
import icons from "../../constants/icons";
import { ScrollView } from "react-native-gesture-handler";
import SearchBar from "../../components/SearchBar";
import { messages } from "../../constants/data";
import { getRelativeTime } from "../../utils/formatTime";
import getInitials from "../../utils/getInitials";

const Messages = () => {
  const [searchRecipient, setSearchRecipient] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshPosts = async () => {
    setIsRefreshing(true);
    setIsRefreshing(false);
  };

  const handleSearchRecipient = async () => {};

  return (
    <View className="flex-1 bg-backgroundColor">
      <Header />
      <ScrollView
        className="px-4 mt-2"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshPosts}
            colors={["#7862BF"]}
            progressBackgroundColor="#222322"
            tintColor="#4ade80"
          />
        }
      >
        <SearchBar
          input={searchRecipient}
          setInput={setSearchRecipient}
          width="w-full"
          position="relative"
          handleSearchedInput={handleSearchRecipient}
          top="0"
        />
        <View className="w-full gap-2 mt-5">
          {messages.map((message, i) => (
            <PlatformPressable
              key={i}
              className="w-full flex-row items-center px-3 py-4 justify-between bg-light-black rounded-2xl"
            >
              <View className="flex-row items-center gap-3">
                <View className="bg-primary rounded-full justify-center items-center flex w-14 h-14">
                  <Text className="font-rBold text-zinc-300 text-2xl">
                    {getInitials(message.fullname)}
                  </Text>
                </View>

                <View className="flex-col justify-self-start w-full flex-shrink">
                  <View className="flex-row gap-1 items-center">
                    <Text
                      className={`text-lg text-zinc-300 ${message.isRead ? "font-rRegular" : "font-rSemibold"}`}
                    >
                      {message.username}
                    </Text>

                    <Text className="text-xs font-rRegular text-zinc-500">
                      {getRelativeTime(message.latestMessageDate)}
                    </Text>
                  </View>

                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className={`text-sm ${message.isRead ? "text-zinc-500 font-rRegular" : "text-zinc-300 font-rSemibold"}`}
                  >
                    {message.latestMessage}
                  </Text>
                </View>
              </View>

              {message.unreadCount > 0 && (
                <View className="absolute right-3 bg-red-500 rounded-full w-5 h-5 self-center justify-center items-center flex">
                  <Text className="text-xs text-zinc-300">
                    {message.unreadCount > 9 ? "9+" : message.unreadCount}
                  </Text>
                </View>
              )}
            </PlatformPressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

function Header() {
  return (
    <View className="w-full flex-row items-center px-4 p-2 justify-between">
      <TouchableOpacity onPress={() => router.back()}>
        <Image
          source={icons.next}
          className="h-7 w-7 -scale-x-[1]"
          resizeMode="contain"
          tintColor={"#d4d4d8"}
        />
      </TouchableOpacity>

      <Text className="text-zinc-300 font-rBold text-2xl">Messages</Text>

      <TouchableOpacity>
        <Image
          source={icons.more}
          className="h-7 w-7 rotate-90"
          resizeMode="contain"
          tintColor={"#d4d4d8"}
        />
      </TouchableOpacity>
    </View>
  );
}

export default Messages;
