import { SplashScreen, Stack } from "expo-router";
import "../styles/global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SystemUI from "expo-system-ui";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CommentBottomSheetProvider } from "../context/commentBottomSheetContext";
import { EvaluateBottomSheetProvider } from "../context/evaluateBottomSheetContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-ExtraBold": require("../assets/fonts/Roboto-ExtraBold.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-SemiBold": require("../assets/fonts/Roboto-SemiBold.ttf"),
  });

  useEffect(() => {
    SystemUI.setBackgroundColorAsync("#010101");
    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <GestureHandlerRootView className="flex-1">
      <EvaluateBottomSheetProvider>
        <CommentBottomSheetProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(screens)" options={{ headerShown: false }} />
          </Stack>
        </CommentBottomSheetProvider>
      </EvaluateBottomSheetProvider>
    </GestureHandlerRootView>
  );
}
