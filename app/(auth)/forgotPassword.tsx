import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import React, { useState } from "react";
import icons from "../../constants/icons";
import Input from "../../components/Input";
import { router } from "expo-router";
import axios from "axios";
import api from "../../configs/api";

type Step = "email" | "otp" | "newPassword";

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/v1/auth/password/request-reset", { email });
      setStep("otp");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Could not send reset code.",
        );
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOtp = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP code.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/v1/auth/password/request-reset/check-otp", {
        email,
        otp,
      });
      setStep("newPassword");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Invalid or expired OTP.",
        );
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      Alert.alert("Error", "Please enter a new password.");
      return;
    }
    setLoading(true);
    try {
      await api.patch("/api/v1/auth/password/reset", {
        email,
        password: newPassword,
      });
      Alert.alert("Success", "Password reset successfully!", [
        { text: "Log In", onPress: () => router.push("/index") },
      ]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Could not reset password.",
        );
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "otp") return setStep("email");
    if (step === "newPassword") return setStep("otp");
    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 bg-backgroundColor">
        <TouchableOpacity
          onPress={handleBack}
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
          {step === "email" && (
            <>
              <Text className="text-zinc-300 font-rBold text-xl">
                Forgot Password?
              </Text>
              <Text className="text-zinc-500 font-rRegular">
                Enter the email associated with your account. We'll send you a
                code to securely reset your password.
              </Text>
              <Input type="email" value={email} setInput={setEmail} />
              <PlatformPressable
                onPress={handleRequestCode}
                disabled={loading}
                className="w-full py-3 bg-[#6856CF] rounded-xl flex justify-center items-center"
              >
                {loading ? (
                  <ActivityIndicator color="#d4d4d8" />
                ) : (
                  <Text className="text-zinc-300 font-rBold text-sm">
                    Send Code
                  </Text>
                )}
              </PlatformPressable>
            </>
          )}

          {step === "otp" && (
            <>
              <Text className="text-zinc-300 font-rBold text-xl">
                Enter OTP
              </Text>
              <Text className="text-zinc-500 font-rRegular">
                We sent a 6-digit code to{" "}
                <Text className="text-zinc-300 font-rBold">{email}</Text>. It
                expires in 60 seconds.
              </Text>
              <TextInput
                placeholder="6-digit code"
                placeholderTextColor={"#52525b"}
                onChangeText={setOtp}
                value={otp}
                keyboardType="numeric"
                maxLength={6}
                className="border rounded-xl px-3 py-4 text-zinc-300 font-rRegular w-full bg-light-black/80 border-zinc-800"
              />
              <PlatformPressable
                onPress={handleCheckOtp}
                disabled={loading}
                className="w-full py-3 bg-[#6856CF] rounded-xl flex justify-center items-center"
              >
                {loading ? (
                  <ActivityIndicator color="#d4d4d8" />
                ) : (
                  <Text className="text-zinc-300 font-rBold text-sm">
                    Verify Code
                  </Text>
                )}
              </PlatformPressable>
              <TouchableOpacity onPress={handleRequestCode} disabled={loading}>
                <Text className="text-zinc-500 font-rRegular text-sm text-center">
                  Didn't receive a code?{" "}
                  <Text className="text-zinc-300 font-rBold">Resend</Text>
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === "newPassword" && (
            <>
              <Text className="text-zinc-300 font-rBold text-xl">
                New Password
              </Text>
              <Text className="text-zinc-500 font-rRegular">
                Create a strong new password for your account.
              </Text>
              <Input
                type="password"
                value={newPassword}
                setInput={setNewPassword}
              />
              <PlatformPressable
                onPress={handleResetPassword}
                disabled={loading}
                className="w-full py-3 bg-[#6856CF] rounded-xl flex justify-center items-center"
              >
                {loading ? (
                  <ActivityIndicator color="#d4d4d8" />
                ) : (
                  <Text className="text-zinc-300 font-rBold text-sm">
                    Reset Password
                  </Text>
                )}
              </PlatformPressable>
            </>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPassword;
