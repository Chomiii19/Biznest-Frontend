import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import "../styles/global.css";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import * as SystemUI from "expo-system-ui";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CommentBottomSheetProvider } from "../context/commentBottomSheetContext";
import { EvaluateBottomSheetProvider } from "../context/evaluateBottomSheetContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-ExtraBold": require("../assets/fonts/Roboto-ExtraBold.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-SemiBold": require("../assets/fonts/Roboto-SemiBold.ttf"),
  });

  const [token, setToken] = useState<string | null | undefined>(undefined);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync("#010101");
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    AsyncStorage.getItem("token").then(setToken);
  }, []);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (token === undefined) return;
    if (!fontsLoaded) return;
    setIsReady(true); // only mark ready when both are resolved
  }, [token, fontsLoaded]);

  useEffect(() => {
    if (!isReady) return;
    if (!segments[0]) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (token && inAuthGroup) {
      router.replace("/(tabs)/evaluate");
    } else if (!token && !inAuthGroup) {
      router.replace("/(auth)");
    }
  }, [isReady, segments, token]);

  if (!fontsLoaded && !error) return null;

  return (
    <GestureHandlerRootView className="flex-1">
      <EvaluateBottomSheetProvider>
        <CommentBottomSheetProvider>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(screens)" options={{ headerShown: false }} />
          </Stack>
        </CommentBottomSheetProvider>
      </EvaluateBottomSheetProvider>
    </GestureHandlerRootView>
  );
}
