import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useEvaluateBottomSheet } from "../context/evaluateBottomSheetContext";
import renderBackdrop from "./BottomSheetBackdrop";
import icons from "../constants/icons";
import { businessTypes, posts } from "../constants/data";
import { getRelativeTime } from "../utils/formatTime";
import CustomDropDown from "./CustomDropDown";
import { useState, useCallback } from "react";
import api from "../configs/api";
import axios from "axios";
import { useRouter } from "expo-router";

function EvaluateBottomSheet() {
  const { snapPoints, evaluateBottomSheetRef, coords } =
    useEvaluateBottomSheet();
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const router = useRouter();
  const isBookmarked = !!bookmarkId;

  const handleSheetChange = useCallback((index: number) => {
    if (index === -1) {
      setBookmarkId(null);
      setSelectedBusinessType("");
    }
  }, []);

  const handleBookmark = async () => {
    if (!coords) return;
    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await api.delete(`/api/v1/locations/bookmarks/${bookmarkId}`);
        setBookmarkId(null);
      } else {
        const { data } = await api.post("/api/v1/locations/bookmarks", {
          coords,
        });
        setBookmarkId(data.bookmarkId ?? data.bookmark?._id ?? "saved");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Could not update bookmark.",
        );
      } else {
        Alert.alert("Error", "Something went wrong.");
      }
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!coords || !selectedBusinessType) return;
    console.log(coords);
    setEvaluating(true);
    try {
      const { data } = await api.post(
        `/api/v1/locations/score?lat=${coords.lat}&lon=${coords.lng}&amenityType=${encodeURIComponent(selectedBusinessType)}`,
      );

      evaluateBottomSheetRef.current?.close();

      router.push({
        pathname: "/(screens)/evaluateResult",
        params: {
          result: JSON.stringify(data.data),
          amenityType: selectedBusinessType,
          lat: String(coords.lat),
          lng: String(coords.lng),
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Could not evaluate location.",
        );
      } else {
        Alert.alert("Error", "Something went wrong.");
      }
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <BottomSheet
      ref={evaluateBottomSheetRef}
      enablePanDownToClose
      backdropComponent={(props) => renderBackdrop(props, 0.3)}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: "#848483" }}
      backgroundStyle={{ backgroundColor: "#1B1A1B" }}
      index={-1}
      enableContentPanningGesture={false}
      onChange={handleSheetChange}
    >
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        className="pt-2 mb-3"
      >
        {/* Header */}
        <View className="flex-row w-full items-center justify-between px-4">
          <Text className="text-zinc-300 font-rBold text-xl">
            Location Overview
          </Text>
          <TouchableOpacity
            onPress={handleBookmark}
            disabled={bookmarkLoading}
            className={`rounded-full p-3 ${isBookmarked ? "bg-primary" : "bg-zinc-800"}`}
          >
            {bookmarkLoading ? (
              <ActivityIndicator size="small" color="#d4d4d8" />
            ) : (
              <Image
                source={icons.bookmark}
                tintColor={isBookmarked ? "#fff" : "#848483"}
                className="h-5 w-5 scale-x-[-1]"
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Rents Nearby */}
        {/* <Text className="font-rRegular text-zinc-300 mt-2 px-4 mb-1">
          Rents Nearby
        </Text>
        <BottomSheetScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4"
        >
          {posts.map((post, i) => (
            <Pressable
              key={i}
              className="bg-zinc-800 rounded-lg flex-row items-center gap-3 mr-4 justify-between overflow-hidden flex-shrink-0"
            >
              <View className="flex-col p-2 justify-between h-full">
                <View className="flex-row items-center gap-2">
                  <Text className="text-zinc-300 font-rBold">
                    {post.username}
                  </Text>
                  <Text className="text-zinc-500 font-rRegular text-xs">
                    {getRelativeTime(post.createdAt)}
                  </Text>
                </View>
                <Text className="text-zinc-300 text-sm font-rRegular">
                  {post.price ? `₱ ${post.price}/month` : "₱ ???"}
                </Text>
                <View className="flex-row justify-between items-center gap-3">
                  <View className="border border-primary px-2 rounded-full">
                    <Text className="text-primary font-rRegular text-xs">
                      500m away
                    </Text>
                  </View>
                  <TouchableOpacity>
                    <Text className="text-sm font-rRegular text-zinc-500">
                      View Post
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Image
                source={post.images_url[0]}
                className="w-32 h-32"
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </BottomSheetScrollView> */}

        {/* Environment Summary */}
        {/* <View className="w-full px-4 flex-row justify-between items-center mt-6">
          <Text className="font-rRegular text-zinc-300 mb-1">
            Environment Summary
          </Text>
          <TouchableOpacity className="bg-primary px-2 py-1 rounded-full">
            <Text className="text-zinc-300 font-rRegular text-xs">
              Pin Landmarks
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-2">
          <BottomSheetScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
          >
            <View className="px-2 py-1 bg-zinc-800 rounded-full justify-center mr-2">
              <Text className="text-zinc-500 font-rRegular">
                🏪 Nearby businesses: 15
              </Text>
            </View>
            <View className="px-2 py-1 bg-zinc-800 rounded-full mr-2">
              <Text className="text-zinc-500 font-rRegular">
                🏫 Nearby schools: 2
              </Text>
            </View>
            <View className="px-2 py-1 bg-zinc-800 rounded-full mr-2">
              <Text className="text-zinc-500 font-rRegular">
                🚌 Nearest transport: Buendia MRT (500m)
              </Text>
            </View>
          </BottomSheetScrollView>
        </View> */}

        {/* Evaluate Section */}
        <Text className="font-rRegular text-zinc-300 mb-1 ml-4 mt-6">
          Evaluate Location
        </Text>
        <View className="ml-4 items-start flex-row gap-2 h-36">
          <CustomDropDown
            dropDownType="Business Type"
            dropDownList={businessTypes}
            stateVariable={selectedBusinessType}
            setStateVariable={setSelectedBusinessType}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          />
          <TouchableOpacity
            onPress={handleEvaluate}
            disabled={!selectedBusinessType || evaluating}
            className={`px-3 py-2 rounded-lg flex-row items-center gap-2 ${
              selectedBusinessType && !evaluating
                ? "bg-green-500"
                : "bg-zinc-800"
            }`}
          >
            {evaluating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : null}
            <Text
              className={`font-rBold ${
                selectedBusinessType && !evaluating
                  ? "text-zinc-300"
                  : "text-icon-stroke"
              }`}
            >
              {evaluating ? "Evaluating..." : "Evaluate"}
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

export default EvaluateBottomSheet;
