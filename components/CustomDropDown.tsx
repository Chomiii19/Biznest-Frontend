import React from "react";
import { Pressable, ScrollView, Image, Text, View } from "react-native";
import icons from "../constants/icons";
import { PlatformPressable } from "@react-navigation/elements";

function CustomDropDown({
  dropDownList,
  dropDownType,
  activeDropdown,
  setActiveDropdown,
  stateVariable,
  setStateVariable,
}: {
  dropDownList: string[];
  dropDownType: string;
  activeDropdown: string | null;
  stateVariable: string;
  setActiveDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  setStateVariable: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <View className="relative z-20 w-[10.5rem]">
      <Pressable
        onPress={() => setActiveDropdown(dropDownType)}
        className={`flex-row justify-between items-center bg-lighter-black rounded-lg h-8 w-[10.5rem] border z-20 ${stateVariable ? "border-primary" : "border-zinc-500"}`}
      >
        <Text
          className={`font-rRegular text-sm ml-2 my-1 ${stateVariable ? "text-primary" : "text-zinc-500"}`}
        >
          {stateVariable ? stateVariable : dropDownType}
        </Text>
        {stateVariable ? (
          <Pressable
            onPress={() => {
              setStateVariable("");
              setActiveDropdown(null);
            }}
          >
            <Image
              source={icons.x}
              className="h-4 w-4 mr-2 "
              tintColor={"#7862BF"}
            />
          </Pressable>
        ) : (
          <Image
            source={icons.down}
            className="h-4 w-4 mr-2 "
            tintColor={"#71717a"}
          />
        )}

        {activeDropdown === dropDownType && (
          <ScrollView className="w-full absolute rounded-lg max-h-36 bg-lighter-black border border-zinc-500 top-9 py-2 z-[100]">
            {dropDownList.map((type, i) => (
              <PlatformPressable
                key={i}
                onPress={() => {
                  setStateVariable(type);
                  setActiveDropdown(null);
                }}
                className="p-2 py-1 w-full"
              >
                <Text
                  className={`font-rRegular text-sm ${type === stateVariable ? "text-primary" : "text-zinc-300"}`}
                >
                  {type}
                </Text>
              </PlatformPressable>
            ))}
          </ScrollView>
        )}
      </Pressable>
    </View>
  );
}

export default CustomDropDown;
