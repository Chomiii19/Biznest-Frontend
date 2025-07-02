import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useRef, useState } from "react";
import { router } from "expo-router";
import icons from "../../constants/icons";
import { conversations } from "../../constants/data";
import { formatTime } from "../../utils/formatTime";
import ConversationBottomSheet from "../../components/ConversationBottomSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import MessagesBottomSheet from "../../components/MessagesBottomSheet";

const ViewConversation = () => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);

  //   BottomSheet Hooks
  const messagesBottomSheetRef = useRef<BottomSheet | null>(null);
  const messageSnapPoints = useMemo(() => ["45%"], []);
  const conversationBottomSheetRef = useRef<BottomSheet | null>(null);
  const snapPoints = useMemo(() => ["25%"], []);
  const openMessageBottomSheet = () => messagesBottomSheetRef.current?.expand();
  const openBottomSheet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    conversationBottomSheetRef.current?.expand();
  };

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
      <KeyboardAvoidingView
        className="flex-1 bg-backgroundColor"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <Header openMessageBottomSheet={openMessageBottomSheet} />
        <FlatList
          data={conversations[0].messages}
          keyExtractor={(_, i) => i.toString()}
          inverted
          renderItem={({ item }) => (
            <View className="w-full flex-row mb-3 px-4">
              <PlatformPressable
                onLongPress={openBottomSheet}
                className={`max-w-[70%] px-3 py-2 flex-col rounded-xl ${
                  item.username === "me"
                    ? "bg-primary ml-auto"
                    : "bg-light-black mr-auto"
                }`}
              >
                <Text className="text-zinc-300 font-rRegular">
                  {item.message}
                </Text>
                <Text
                  className={`self-end text-xs font-rRegular ${item.username === "me" ? "text-zinc-400" : "text-zinc-500"}`}
                >
                  {formatTime(item.date)}
                </Text>
              </PlatformPressable>
            </View>
          )}
        />

        <View className="items-center justify-between flex-row gap-3 w-full px-4 pb-3">
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={icons.image}
              resizeMode="contain"
              className="h-7 w-7"
              tintColor={"#71717a"}
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Message chomi_b..."
            placeholderTextColor={"#71717a"}
            multiline
            value={message}
            onChangeText={setMessage}
            textAlignVertical="top"
            scrollEnabled
            className="bg-zinc-800/80 rounded-lg text-zinc-300 font-rRegular max-h-36 flex-1"
          />
          <TouchableOpacity
            className={`p-2 rounded-full ${
              message.length > 0 ? "bg-primary" : "bg-zinc-800/80"
            }`}
          >
            <Image
              source={icons.send}
              resizeMode="contain"
              className="h-5 w-5"
              tintColor={message.length > 0 ? "#d4d4d8" : "#71717a"}
            />
          </TouchableOpacity>
        </View>

        <ConversationBottomSheet
          conversationBottomSheetRef={conversationBottomSheetRef}
          snapPoints={snapPoints}
        />
        <MessagesBottomSheet
          messagesBottomSheetRef={messagesBottomSheetRef}
          snapPoints={messageSnapPoints}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

function Header({
  openMessageBottomSheet,
}: {
  openMessageBottomSheet: () => void;
}) {
  return (
    <View className="w-full flex-row items-center px-4 p-2 justify-between border-b border-b-zinc-800">
      <View className="flex-row gap-2 items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={icons.next}
            className="h-7 w-7 -scale-x-[1]"
            resizeMode="contain"
            tintColor={"#d4d4d8"}
          />
        </TouchableOpacity>

        <View className="items-center flex-row gap-1">
          <View className="h-10 w-10 rounded-full bg-primary justify-center flex items-center">
            <Text className="text-zinc-300 font-rBold text-xl">JB</Text>
          </View>
          <Text className="text-zinc-300 font-rBold text-lg">chomi_b</Text>
        </View>
      </View>

      <TouchableOpacity onPress={openMessageBottomSheet}>
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

export default ViewConversation;
