import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";

type InputParam = {
  type: "email" | "password" | "username";
  value: string;
  label?: string;
  borderColor?: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
};

export default function Input({
  type,
  value,
  label,
  borderColor = "#6856CF",
  setInput,
}: InputParam) {
  const [error, setError] = useState<string | null>(null);

  const validate = (text: string) => {
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setError(emailRegex.test(text) ? null : "Invalid email address");
    }

    if (type === "password") {
      setError(
        text.length >= 8 ? null : "Password must be at least 8 characters"
      );
    }

    setInput(text);
  };

  return (
    <View className="py-1 px-2">
      {label && <Text className="text-black mb-1">{label}</Text>}

      <TextInput
        secureTextEntry={type === "password"}
        keyboardType={type === "email" ? "email-address" : "default"}
        placeholder={`${type.slice(0, 1).toUpperCase().concat(type.slice(1, type.length))}...`}
        onChangeText={validate}
        value={value}
        className="border-[1px] rounded-lg px-3 py-2 text-gray-900"
        style={{
          borderColor: error ? "red" : borderColor,
        }}
      />

      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
