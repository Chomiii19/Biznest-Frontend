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
import images from "../../constants/images";
import { posts } from "../../constants/data";
import { getRelativeTime } from "../../utils/formatTime";

const Rents = () => {
  const [hasHearted, setHasHearted] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);

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
    <View className="flex-1 bg-backgroundColor pt-2">
      <Header />
      <ScrollView>
        <View className="px-4 flex flex-col gap-5 mb-24">
          {posts.map((post, i) => (
            <View
              key={i}
              className="w-full bg-light-black/80 rounded-xl p-3 pt-4 flex-col gap-3"
            >
              <View className="w-full justify-between flex-row items-center">
                <View className="flex flex-col">
                  <Text className="text-zinc-300 font-rSemibold text-lg">
                    {post.username}
                  </Text>
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

              <Text className="text-zinc-300 font-rRegular">
                {post.description.length > 200
                  ? post.description.slice(0, 200).concat("...")
                  : post.description}
              </Text>

              {post.images_url.length === 1 && (
                <PostImage image={post.images_url[0]} />
              )}

              <View className="w-full flex-row justify-between items-center">
                <View className="gap-2 flex-row items-center">
                  <View className="gap-1 flex-row items-center">
                    <TouchableWithoutFeedback onPress={handlePress}>
                      <Animated.View
                        style={[
                          styles.iconContainer,
                          { transform: [{ scale }] },
                        ]}
                      >
                        <Image
                          source={
                            hasHearted ? icons["heart-fill"] : icons.heart
                          }
                          tintColor={hasHearted ? "#7862BF" : "#848483"}
                          className="h-[1.7rem] w-[1.7rem]"
                          resizeMode="contain"
                        />
                      </Animated.View>
                    </TouchableWithoutFeedback>
                    <Text className="text-zinc-500 font-rRegular text-sm">
                      500
                    </Text>
                  </View>

                  <View className="gap-1 flex-row items-center">
                    <Image
                      source={icons.comment}
                      tintColor={"#848483"}
                      className="h-6 w-6"
                    />
                    <Text className="text-zinc-500 font-rRegular text-sm">
                      500
                    </Text>
                  </View>

                  <Image
                    source={icons.bookmark}
                    tintColor={"#848483"}
                    className="h-5 w-5"
                  />
                </View>

                <TouchableOpacity className="bg-primary px-2 py-1 rounded-md">
                  <Text className="text-zinc-300 font-rSemibold text-xs">
                    Contact Owner
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

function Header() {
  return (
    <View className="w-full px-4 flex-row items-center justify-between mb-4">
      <Text className="text-zinc-300 font-rBold text-3xl">Rents</Text>

      <View className="flex-row items-center gap-3">
        <TouchableOpacity className="flex-row items-center gap-1 border border-icon-stroke rounded-full p-1.5">
          <Image
            source={icons.search}
            tintColor="#848483"
            className="h-4 w-4 scale-x-[-1]"
          />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center gap-1 border border-icon-stroke rounded-full py-1 px-2">
          <Image
            source={icons.addition}
            tintColor="#848483"
            className="h-4 w-4"
          />
          <Text className="text-icon-stroke text-xs font-rRegular">
            Create Post
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center gap-1 border border-icon-stroke rounded-full py-1 px-2">
          <Image
            source={icons.filter}
            tintColor="#848483"
            className="h-4 w-4"
          />
          <Text className="text-icon-stroke text-xs font-rRegular">Filter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

type Props = {
  image: any;
  maxHeight?: number;
};

const PostImage = ({ image, maxHeight = 300 }: Props) => {
  const { width } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState<number | null>(null);

  useEffect(() => {
    const layoutWidth = width - 32;

    const setScaledHeight = (imgW: number, imgH: number) => {
      const ratio = imgH / imgW;
      const scaledHeight = layoutWidth * ratio;
      setImageHeight(Math.min(scaledHeight, maxHeight));
    };

    if (typeof image === "number") {
      const { width: imgW, height: imgH } = Image.resolveAssetSource(image);
      setScaledHeight(imgW, imgH);
    } else if (typeof image === "string") {
      Image.getSize(
        image,
        (imgW, imgH) => setScaledHeight(imgW, imgH),
        () => setImageHeight(maxHeight)
      );
    }
  }, [image, width, maxHeight]);

  if (imageHeight === null) {
    return (
      <View
        style={{
          width: width - 32,
          height: 200,
          borderRadius: 12,
          backgroundColor: "#1a1a1a",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="#888" />
      </View>
    );
  }

  return (
    <Image
      source={typeof image === "string" ? { uri: image } : image}
      style={{
        width: width - 48,
        height: imageHeight,
        borderRadius: 12,
      }}
      resizeMode="cover"
    />
  );
};

export default Rents;

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
