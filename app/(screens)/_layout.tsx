import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="changePassword"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="contactUs"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="createPost"
        options={{ animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="editProfile"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen name="FAQ" options={{ animation: "slide_from_right" }} />
      <Stack.Screen
        name="feedback"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="notifications"
        options={{ animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="reportIssue"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="selectLocation"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="settings"
        options={{ animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="viewPost"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="viewProfile"
        options={{ animation: "slide_from_right" }}
      />
    </Stack>
  );
}
