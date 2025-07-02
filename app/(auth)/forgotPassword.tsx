import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import React, { useState } from "react";
import icons from "../../constants/icons";
import Input from "../../components/Input";
import { router } from "expo-router";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 bg-backgroundColor">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row gap-1 items-center ml-4 mt-1"
        >
          <Image
            source={icons.next}
            className="h-7 w-7 -scale-x-[1]"
            resizeMode="contain"
            tintColor={"#d4d4d8"}
          />
          <Text className="text-zinc-300 font-rBold text-xl">Return</Text>
        </TouchableOpacity>
        <View className="w-full flex-row justify-center mt-10">
          <Image
            source={icons.icon}
            className="h-14 w-14"
            resizeMode="contain"
          />
        </View>

        <View className="w-full flex-col gap-4 mt-10 px-4">
          <Text className="text-zinc-300 font-rBold text-xl">
            Forgot Password?
          </Text>
          <Text className="text-zinc-500 font-rRegular">
            Enter the email associated with your account. We'll send you a code
            to securely reset your password.
          </Text>

          <Input type="email" value={email} setInput={setEmail} />

          <PlatformPressable className="w-full py-3 bg-[#6856CF] rounded-xl flex justify-center items-center">
            <Text className="text-zinc-300 font-rBold text-sm">Send Code</Text>
          </PlatformPressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPassword;
