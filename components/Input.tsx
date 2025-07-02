import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import icons from "../constants/icons";

type InputParam = {
  type: "email" | "password" | "username";
  value: string;
  label?: string;
  placeholder?: string;
  borderColor?: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
};

export default function Input({
  type,
  value,
  label,
  placeholder,
  borderColor = "#27272a",
  setInput,
}: InputParam) {
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = (text: string) => {
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(text) ? "" : "Invalid email address");
    }

    if (type === "password") {
      setPasswordError(
        text.length >= 8 ? "" : "Password must be at least 8 characters",
      );
    }

    setInput(text);
  };

  const currentBorderColor =
    (type === "email" && emailError) || (type === "password" && passwordError)
      ? "red"
      : borderColor;

  return (
    <View className="py-1 w-full">
      {label && <Text className="text-black mb-1">{label}</Text>}

      <View className="w-full flex-row">
        <TextInput
          secureTextEntry={type === "password" && !showPassword}
          keyboardType={type === "email" ? "email-address" : "default"}
          placeholder={
            placeholder ||
            `${type.slice(0, 1).toUpperCase().concat(type.slice(1, type.length))}`
          }
          placeholderTextColor={"#52525b"}
          onChangeText={validate}
          value={value}
          className="border rounded-xl px-3 py-4 text-zinc-300 font-rRegular w-full bg-light-black/80"
          style={{
            borderColor: currentBorderColor,
          }}
        />
        {type === "password" && (
          <TouchableOpacity
            className="absolute right-4 self-center"
            onPress={() => setShowPassword((prev) => !prev)}
          >
            <Image
              source={showPassword ? icons.eyeClose : icons.eye}
              className="h-7 w-7 -scale-x-[1]"
              resizeMode="contain"
              tintColor={"#71717a"}
            />
          </TouchableOpacity>
        )}
      </View>

      {passwordError && (
        <Text className="text-red-500 text-xs mt-1">{passwordError}</Text>
      )}
      {emailError && (
        <Text className="text-red-500 text-xs mt-1">{emailError}</Text>
      )}
    </View>
  );
}
