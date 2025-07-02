import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import icons from "../../constants/icons";
import { faqs } from "../../constants/data";

const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <View className="flex-1 bg-backgroundColor">
      <Header />

      <ScrollView className="px-4 mt-3">
        <View className="flex-1 flex-col gap-5">
          {faqs.map((faq, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="bg-light-black rounded-xl w-full flex-col px-3 py-2"
            >
              <View className="w-full flex-row items-center justify-between gap-4">
                <Text className="text-zinc-300 text-xl font-rBold flex-1">
                  {faq.question}
                </Text>
                <Image
                  source={icons.next}
                  className={`h-7 w-7 ${expandedIndex === i ? "-rotate-90" : "rotate-90"}`}
                  resizeMode="contain"
                  tintColor={"#d4d4d8"}
                />
              </View>
              {expandedIndex === i && (
                <Text className="text-zinc-300 font-rRegular flex-1 mt-2">
                  {faq.answer}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

function Header() {
  return (
    <View className="w-full flex-row items-center px-4 p-2 justify-center">
      <TouchableOpacity
        className="absolute left-4"
        onPress={() => router.back()}
      >
        <Image
          source={icons.next}
          className="h-7 w-7 -scale-x-[1]"
          resizeMode="contain"
          tintColor={"#d4d4d8"}
        />
      </TouchableOpacity>

      <Text className="text-zinc-300 font-rBold text-2xl justify-self-center">
        FAQs
      </Text>
    </View>
  );
}

export default FAQ;
