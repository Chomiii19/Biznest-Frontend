import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  StatusBar,
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/api/v1/auth/login", {
        email,
        password,
      });
      try {
        await AsyncStorage.setItem("token", data.token);
      } catch (e) {
        console.log("AsyncStorage error:", e);
      }
      router.replace("/evaluate");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Login Failed",
          error.response?.data?.message || "Invalid credentials.",
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
        <StatusBar barStyle={"light-content"} />
        <View className="w-full flex-row justify-center mt-10">
          <Image
            source={icons.icon}
            className="h-14 w-14"
            resizeMode="contain"
          />
        </View>

        <View className="w-full flex-col gap-4 mt-10 px-4">
          <Text className="text-zinc-300 font-rBold text-xl">
            Log in to Biznest
          </Text>
          <Text className="text-zinc-500 font-rRegular">
            Find your ideal business location with smart evaluation
          </Text>

          <Input type="email" value={email} setInput={setEmail} />
          <Input type="password" value={password} setInput={setPassword} />

          <TouchableOpacity onPress={() => router.push("/forgotPassword")}>
            <Text className="text-zinc-300 font-rBold text-sm">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <PlatformPressable
            onPress={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-[#6856CF] rounded-xl flex justify-center items-center"
          >
            {loading ? (
              <ActivityIndicator color="#d4d4d8" />
            ) : (
              <Text className="text-zinc-300 font-rBold text-sm">Log In</Text>
            )}
          </PlatformPressable>

          
          <View className="flex-row gap-1 mt-2 items-center">
            <Text className="text-zinc-500 font-rRegular text-sm">
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text className="text-zinc-300 font-rBold text-sm">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
