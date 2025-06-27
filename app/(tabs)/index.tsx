import { View, Text, StatusBar } from "react-native";
import React from "react";

const Home = () => {
  return (
    <View className="flex-1 bg-backgroundColor">
      <StatusBar barStyle={"light-content"} />
      <Text>Home</Text>
    </View>
  );
};

export default Home;
