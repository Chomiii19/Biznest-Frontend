import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useState, useRef } from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import renderBackdrop from "./BottomSheetBackdrop";
import icons from "../constants/icons";

function ConversationBottomSheet({
  conversationBottomSheetRef,
  snapPoints,
}: {
  conversationBottomSheetRef: React.RefObject<BottomSheet | null>;
  snapPoints: string[];
}) {
  return (
    <BottomSheet
      enablePanDownToClose
      enableContentPanningGesture={false}
      index={-1}
      ref={conversationBottomSheetRef}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: "#848483" }}
      backgroundStyle={{ backgroundColor: "#1B1A1B" }}
      backdropComponent={(props) => renderBackdrop(props, 0.6)}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BottomSheetView className="pt-2 bg-light-black w-full h-full flex-col gap-2">
          <PlatformPressable className="px-4 py-3 items-center flex-row justify-between">
            <Text className="font-rRegular text-zinc-300 text-xl">Copy</Text>
            <Image
              source={icons.copy}
              resizeMode="contain"
              className="h-5 w-5"
              tintColor={"#d4d4d8"}
            />
          </PlatformPressable>
          <PlatformPressable className="px-4 py-3 items-center flex-row justify-between">
            <Text className="font-rRegular text-zinc-300 text-xl">Delete</Text>
            <Image
              source={icons.bin}
              resizeMode="contain"
              className="h-5 w-5"
              tintColor={"#d4d4d8"}
            />
          </PlatformPressable>
          <PlatformPressable className="px-4 py-3 items-center flex-row justify-between">
            <Text className="font-rRegular text-red-500 text-xl">Report</Text>
            <Image
              source={icons.warning}
              resizeMode="contain"
              className="h-5 w-5"
              tintColor={"#ef4444"}
            />
          </PlatformPressable>
        </BottomSheetView>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
}

export default ConversationBottomSheet;

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
