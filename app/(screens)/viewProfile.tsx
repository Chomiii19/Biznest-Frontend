import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { formatCount } from "../../utils/formatCount";
import icons from "../../constants/icons";
import { userPosts } from "../../constants/data";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const ViewProfile = () => {
  const [follow, setFollow] = useState(false);

  return (
    <View className="flex-1 bg-backgroundColor px-4">
      <TouchableOpacity
        className="absolute top-1 left-5"
        onPress={() => router.back()}
      >
        <Image
          source={icons.next}
          className="h-8 w-8 -scale-x-[1]"
          resizeMode="contain"
          tintColor={"#d4d4d8"}
        />
      </TouchableOpacity>

      <View className="flex-row items-center gap-4 absolute top-1 right-5">
        <TouchableOpacity onPress={() => router.push("/(screens)/settings")}>
          <Image
            source={icons.more}
            tintColor={"#848483"}
            className="h-8 w-8 rotate-90"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View className="h-40 w-40 rounded-full bg-primary p-5 self-center flex justify-center items-center absolute z-50 border-8 border-backgroundColor mt-4">
        <Text className="text-5xl text-zinc-300 font-rBold">JB</Text>
      </View>

      <View className="bg-light-black rounded-3xl w-full mt-24">
        <View className="flex-col items-center justify-center w-full mt-24">
          <View className="flex-row items-center gap-1">
            <Text className="text-zinc-300 font-rBold text-2xl">
              Jomari Borines
            </Text>
            <Text className="text-primary px-2 py-0.5 text-[8px] border border-primary rounded-full">
              PREMIUM
            </Text>
          </View>
          <Text className="text-zinc-500 font-rRegular">chomi_b</Text>
        </View>

        <View className="w-full flex-row px-20 justify-between items-center py-5">
          <View className="flex-col items-center justify-center">
            <Text className="font-rSemibold text-zinc-300 text-xl">
              {formatCount(362)}
            </Text>
            <Text className="font-rRegular text-zinc-500">Followers</Text>
          </View>
          <View className="flex-col items-center justify-center">
            <Text className="font-rSemibold text-zinc-300 text-xl">
              {formatCount(3)}
            </Text>
            <Text className="font-rRegular text-zinc-500">Posts</Text>
          </View>
          <View className="flex-col items-center justify-center">
            <Text className="font-rSemibold text-zinc-300 text-xl">
              {formatCount(13320)}
            </Text>
            <Text className="font-rRegular text-zinc-500">Likes</Text>
          </View>
        </View>

        <View className="w-full flex-row gap-3 items-center px-16 mb-3">
          <TouchableOpacity
            onPress={() => setFollow((prev) => !prev)}
            className={`flex-1 flex justify-center items-center py-2 rounded-xl border border-primary ${follow ? "bg-primary" : ""}`}
          >
            <Text
              className={`font-rBold textlg ${follow ? "text-zinc-300" : "text-primary"}`}
            >
              {follow ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/viewConversation")}
            className="flex-1 flex justify-center items-center py-2 rounded-xl bg-zinc-600"
          >
            <Text className="font-rBold textlg text-zinc-300">Message</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="mt-6">
        <View className="flex-row flex-wrap justify-between mb-24">
          {userPosts.map((post, i) => (
            <TouchableOpacity
              key={i}
              className="w-[48%] h-60 bg-zinc-700 mb-4 rounded-2xl"
            >
              <Image
                source={post.images_url[0]}
                className="w-full h-full rounded-2xl"
                resizeMode="cover"
              />
              <LinearGradient
                colors={["transparent", "#010101"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="h-full w-full absolute opacity-80"
              />
              <View className="flex-row items-center gap-2 absolute bottom-1 right-3">
                <View className="flex-row items-center gap-1">
                  <Image
                    source={icons.heart}
                    tintColor={"#848483"}
                    className="h-5 w-5"
                    resizeMode="contain"
                  />
                  <Text className="text-zinc-500 font-rRegular text-sm">
                    {formatCount(post.heart_count)}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Image
                    source={icons.comment}
                    tintColor={"#848483"}
                    className="h-5 w-5"
                    resizeMode="contain"
                  />
                  <Text className="text-zinc-500 font-rRegular text-sm">
                    {formatCount(post.comment_count)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ViewProfile;
