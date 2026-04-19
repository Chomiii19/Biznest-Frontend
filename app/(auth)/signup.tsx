import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import React, { useState } from "react";
import icons from "../../constants/icons";
import Input from "../../components/Input";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "../../configs/api";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!firstname || !surname || !username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/api/v1/auth/signup", {
        firstname,
        surname,
        username,
        email,
        password,
      });
      await AsyncStorage.setItem("token", data.token);
      router.push("/(tabs)/evaluate");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Sign Up Failed",
          error.response?.data?.message || "Could not create account.",
        );
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 bg-backgroundColor">
        <View className="w-full flex-row justify-center mt-10">
          <Image
            source={icons.icon}
            className="h-14 w-14"
            resizeMode="contain"
          />
        </View>

        <View className="w-full flex-col gap-4 mt-10 px-4">
          <Text className="text-zinc-300 font-rBold text-xl">
            Sign up to Biznest
          </Text>
          <Text className="text-zinc-500 font-rRegular">
            Find your ideal business location with smart evaluation
          </Text>

          <View className="flex-row w-full gap-3 items-center">
            <TextInput
              placeholder="Firstname"
              placeholderTextColor={"#52525b"}
              onChangeText={setFirstname}
              value={firstname}
              className="border rounded-xl px-3 py-4 text-zinc-300 font-rRegular flex-1 bg-light-black/80 border-zinc-800"
            />
            <TextInput
              placeholder="Surname"
              placeholderTextColor={"#52525b"}
              onChangeText={setSurname}
              value={surname}
              className="border rounded-xl px-3 py-4 text-zinc-300 font-rRegular flex-1 bg-light-black/80 border-zinc-800"
            />
          </View>

          <TextInput
            placeholder="Username"
            placeholderTextColor={"#52525b"}
            onChangeText={setUsername}
            value={username}
            className="border rounded-xl px-3 py-4 text-zinc-300 font-rRegular w-full bg-light-black/80 border-zinc-800"
          />

          <Input type="email" value={email} setInput={setEmail} />
          <Input type="password" value={password} setInput={setPassword} />

          <PlatformPressable
            onPress={handleSignup}
            disabled={loading}
            className="w-full py-3 bg-[#6856CF] rounded-xl flex justify-center items-center"
          >
            {loading ? (
              <ActivityIndicator color="#d4d4d8" />
            ) : (
              <Text className="text-zinc-300 font-rBold text-sm">Sign Up</Text>
            )}
          </PlatformPressable>

          <View className="flex w-full items-center justify-center my-5">
            <View className="w-full h-[0.5px] bg-zinc-800 absolute self-center" />
            <Text className="text-xs text-zinc-500 px-3 bg-backgroundColor">
              Or authorize with
            </Text>
          </View>

          <View className="flex-row gap-3 items-center">
            <PlatformPressable className="flex-1 py-3 justify-center items-center flex-row border-zinc-800 rounded-xl bg-light-black/80 border gap-2">
              <Image
                source={icons.google}
                className="h-6 w-6"
                resizeMode="contain"
              />
              <Text className="text-zinc-300 font-rSemibold">Google</Text>
            </PlatformPressable>
            <PlatformPressable className="flex-1 py-3 justify-center items-center flex-row border-zinc-800 rounded-xl bg-light-black/80 border gap-2">
              <Image
                source={icons.facebook}
                className="h-6 w-6"
                resizeMode="contain"
              />
              <Text className="text-zinc-300 font-rSemibold">Facebook</Text>
            </PlatformPressable>
          </View>

          <View className="flex-row gap-1 mt-2 items-center">
            <Text className="text-zinc-500 font-rRegular text-sm">
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text className="text-zinc-300 font-rBold text-sm">Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Signup;
