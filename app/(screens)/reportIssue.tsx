import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { Alert } from "react-native";

import React, { useState } from "react";
import { router } from "expo-router";
import icons from "../../constants/icons";

const ReportIssue = () => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const clearStates = () => {
    Keyboard.dismiss();
    setSubject("");
    setDescription("");
  };

  const confirmBack = () => {
    if (subject || description) {
      Alert.alert(
        "Discard changes?",
        "You have unsaved changes. If you go back now, your edits will be lost.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              clearStates();
              router.back();
            },
          },
        ],
      );
    } else {
      router.back();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 bg-backgroundColor">
        <Header confirmBack={confirmBack} />

        <View className="p-4 flex-col w-full gap-5">
          {/* Subject */}
          <View className="w-full flex-col">
            <Text className="text-zinc-500 text-sm font-rRegular">Subject</Text>
            <TextInput
              placeholder="E.g. Scammer, Bug, Inaccurate Info"
              placeholderTextColor={"#71717a"}
              value={subject}
              onChangeText={setSubject}
              className="border border-zinc-800 bg-light-black rounded-xl font-rBold text-zinc-300 px-2 w-full"
            />
          </View>

          {/* Description */}
          <View className="w-full flex-col">
            <Text className="text-zinc-500 text-sm font-rRegular">
              Description
            </Text>
            <TextInput
              multiline
              textAlignVertical="top"
              placeholder="Please provide more details about your concern..."
              numberOfLines={5}
              placeholderTextColor={"#71717a"}
              value={description}
              onChangeText={setDescription}
              className="border border-zinc-800 bg-light-black rounded-xl font-rRegular text-zinc-300 px-2 w-full min-h-24"
            />
          </View>

          {/* Save Button */}
          <View className="w-full items-center justify-center flex-col">
            <TouchableOpacity
              onPress={clearStates}
              disabled={!subject && !description}
              className={`w-full rounded-xl justify-between items-center py-3 ${subject && description ? "bg-red-500" : "bg-zinc-700"}`}
            >
              <Text
                className={`text-lg font-rBold ${subject && description ? "text-zinc-300" : "text-zinc-500"}`}
              >
                Submit
              </Text>
            </TouchableOpacity>

            <Text className="text-xs text-zinc-600 font-rRegular mt-2 text-center w-[80%]">
              Our team will contact you through your email once your report is
              reviewed.
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

function Header({ confirmBack }: { confirmBack: () => void }) {
  return (
    <View className="w-full flex-row items-center px-4 p-2 justify-center">
      <TouchableOpacity className="absolute left-4" onPress={confirmBack}>
        <Image
          source={icons.next}
          className="h-7 w-7 -scale-x-[1]"
          resizeMode="contain"
          tintColor={"#d4d4d8"}
        />
      </TouchableOpacity>

      <Text className="text-zinc-300 font-rBold text-2xl justify-self-center">
        Report Issue
      </Text>
    </View>
  );
}

export default ReportIssue;
