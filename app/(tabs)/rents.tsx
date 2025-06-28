import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import icons from "../../constants/icons";
import { comments, posts } from "../../constants/data";
import { getRelativeTime } from "../../utils/formatTime";
import { formatCount } from "../../utils/formatCount";
import FilterModal from "../../components/FilterModal";
import { useBottomSheet } from "../../context/bottomSheetContext";
import { router } from "expo-router";
import ImageResolution from "../../components/ImageResolution";

const Rents = () => {
  const [isVisibleFilterModal, setIsVisibleFilterModal] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  return (
    <View className="flex-1 bg-backgroundColor">
      <Header
        isFiltering={isFiltering}
        setIsVisibleFilterModal={setIsVisibleFilterModal}
      />
      {isVisibleFilterModal && (
        <FilterModal
          setIsFiltering={setIsFiltering}
          setIsVisibleFilterModal={setIsVisibleFilterModal}
        />
      )}
      <ScrollView>
        <Posts />
      </ScrollView>
    </View>
  );
};

function Posts({}) {
  const { openBottomSheet, loadComments, setPostOwner } = useBottomSheet();
  const [hasHearted, setHasHearted] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [fullDescription, setFullDescription] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;

  const animate = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.4,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    setHasHearted(!hasHearted);
    animate();
  };

  return (
    <View className="px-4 flex flex-col gap-5 mb-24">
      {posts.map((post, i) => (
        <View
          key={i}
          className="w-full bg-light-black/80 rounded-xl p-3 pt-4 flex-col gap-3"
        >
          <View className="w-full justify-between flex-row items-center">
            <View className="flex flex-col">
              <View className="flex-row items-center gap-1.5">
                <Text className="text-zinc-300 font-rSemibold text-lg">
                  {post.username}
                </Text>
                <TouchableOpacity className="bg-primary px-2 py-1 rounded-md">
                  <Text className="text-zinc-300 font-rSemibold text-xs">
                    Message
                  </Text>
                </TouchableOpacity>
              </View>
              <Text className="text-zinc-500 font-rRegular text-sm">
                {getRelativeTime(post.createdAt)}
              </Text>
            </View>
            <TouchableOpacity className="bg-lighter-black rounded-full p-2">
              <Image
                className="h-5 w-5"
                resizeMode="contain"
                source={icons.more}
              />
            </TouchableOpacity>
          </View>

          <View className="flex-col gap-1">
            <View className="flex-row gap-1 items-center">
              <Image
                source={icons.peso}
                tintColor={"#7862BF"}
                className="h-5 w-5"
                resizeMode="contain"
              />
              <Text className="text-zinc-500 font-rRegular text-sm">
                {post.price !== null
                  ? `${formatCount(post.price)}/month`
                  : "???"}
              </Text>
            </View>

            <View className="flex-row gap-1 items-center">
              <Image
                source={icons.pin}
                tintColor={"#7862BF"}
                className="h-5 w-5"
                resizeMode="contain"
              />
              <Text className="text-zinc-500 font-rRegular text-sm">
                {post.address.length > 40
                  ? post.address.slice(0, 40).concat("...")
                  : post.address}
              </Text>
            </View>

            <Text className="text-zinc-300 font-rRegular">
              {post.description.length > 100
                ? post.description.slice(0, 100).concat("...")
                : post.description}
            </Text>
          </View>

          {post.images_url.length === 1 && (
            <ImageResolution image={post.images_url[0]} />
          )}

          <View className="w-full flex-row justify-between items-center">
            <View className="gap-2 flex-row items-center">
              <View className="gap-1 flex-row items-center">
                <TouchableWithoutFeedback onPress={handlePress}>
                  <Animated.View
                    style={[styles.iconContainer, { transform: [{ scale }] }]}
                  >
                    <Image
                      source={hasHearted ? icons["heart-fill"] : icons.heart}
                      tintColor={hasHearted ? "#7862BF" : "#848483"}
                      className="h-5 w-5"
                      resizeMode="contain"
                    />
                  </Animated.View>
                </TouchableWithoutFeedback>
                <Text className="text-zinc-500 font-rRegular text-sm">
                  {formatCount(post.heart_count)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  openBottomSheet();
                  loadComments(comments);
                  setPostOwner(post.username);
                }}
                className="gap-1 flex-row items-center"
              >
                <Image
                  source={icons.comment}
                  tintColor={"#848483"}
                  className="h-5 w-5"
                />
                <Text className="text-zinc-500 font-rRegular text-sm">
                  {formatCount(post.comment_count)}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="flex-row items-center">
              <Text className="text-zinc-500 font-rRegular text-sm">
                Evaluation Result
              </Text>
              <Image
                source={icons.next}
                tintColor={"#71717a"}
                className="h-4 w-4"
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

function Header({
  isFiltering,
  setIsVisibleFilterModal,
}: {
  isFiltering: boolean;
  setIsVisibleFilterModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <View className="w-full px-4 flex-row items-center justify-between mb-4 mt-2">
      <Text className="text-zinc-300 font-rBold text-3xl">Rents</Text>

      <View className="flex-row items-center gap-3">
        <TouchableOpacity className="flex-row items-center gap-1 border border-icon-stroke rounded-full p-1.5">
          <Image
            source={icons.search}
            tintColor="#848483"
            className="h-4 w-4 scale-x-[-1]"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(screens)/createPost")}
          className="flex-row items-center gap-1 border border-icon-stroke rounded-full py-1 px-2"
        >
          <Image
            source={icons.addition}
            tintColor="#848483"
            className="h-4 w-4"
          />
          <Text className="text-icon-stroke text-xs font-rRegular">
            Create Post
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsVisibleFilterModal((prev) => !prev)}
          className={`flex-row items-center gap-1 border rounded-full py-1 px-2 ${isFiltering ? "border-primary" : "border-icon-stroke"}`}
        >
          <Image
            source={icons.filter}
            tintColor={isFiltering ? "#7862BF" : "#848483"}
            className="h-4 w-4"
          />
          <Text
            className={`text-icon-stroke text-xs font-rRegular ${isFiltering ? "text-primary" : "text-icon-stroke"}`}
          >
            Filter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Rents;

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
