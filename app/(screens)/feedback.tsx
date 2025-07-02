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

const Feedback = () => {
  const [message, setMessage] = useState("");
  const [rate, setRate] = useState(0);

  const clearStates = () => {
    Keyboard.dismiss();
    setMessage("");
    setRate(0);
  };

  const confirmBack = () => {
    if (message) {
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
          <View className="flex-row items-center gap-3 w-full justify-center">
            {[1, 2, 3, 4, 5].map((star, i) => (
              <TouchableOpacity key={i} onPress={() => setRate(star)}>
                <Image
                  source={star <= rate ? icons["star-fill"] : icons.star}
                  className="h-10 w-10 -scale-x-[1]"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Message */}
          <View className="w-full flex-col">
            <Text className="text-zinc-500 text-sm font-rRegular">Message</Text>
            <TextInput
              multiline
              textAlignVertical="top"
              placeholder="We would love to hear your experience with us!"
              numberOfLines={5}
              placeholderTextColor={"#71717a"}
              value={message}
              onChangeText={setMessage}
              className="border border-zinc-800 bg-light-black rounded-xl font-rRegular text-zinc-300 px-2 w-full min-h-24"
            />
          </View>

          {/* Save Button */}

          <TouchableOpacity
            onPress={clearStates}
            disabled={rate === 0}
            className={`w-full rounded-xl justify-between items-center py-3 ${rate !== 0 ? "bg-primary" : "bg-zinc-700"}`}
          >
            <Text
              className={`text-lg font-rBold ${rate !== 0 ? "text-zinc-300" : "text-zinc-500"}`}
            >
              Submit
            </Text>
          </TouchableOpacity>
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
        Feedback
      </Text>
    </View>
  );
}

export default Feedback;
