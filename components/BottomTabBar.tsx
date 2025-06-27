import { View, Image, Text, Pressable } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import icons from "../constants/icons";

const BottomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View className="flex-row w-[22rem] justify-between bg-light-black rounded-full p-1 self-center bottom-4 gap-5 absolute ele">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const icon = options.tabBarLabel as keyof typeof icons;
        const label = options.title !== undefined ? options.title : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            className={`flex-row p-3 gap-2 items-center justify-center rounded-full ${isFocused ? "bg-primary" : ""}`}
          >
            <Image
              className="h-7 w-7"
              tintColor={isFocused ? "#ffff" : "#848483"}
              resizeMode="contain"
              source={icons[`${icon}`]}
            />
            {isFocused && (
              <Text className="text-white text-sm font-rRegular">
                {label as string}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

export default BottomTabBar;
