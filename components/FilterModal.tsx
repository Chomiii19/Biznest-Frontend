import React, { useState } from "react";
import {
  Pressable,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import {
  biznestScore,
  businessTypes,
  cities,
  priceRange,
  rentalTerm,
} from "../constants/data";
import icons from "../constants/icons";

function FilterModal({
  setIsVisibleFilterModal,
  setIsFiltering,
}: {
  setIsVisibleFilterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFiltering: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedRentalTerm, setSelectedRentalTerm] = useState("");
  const [selectedBiznestScore, setSelectedBiznestScore] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const clearStates = () => {
    setIsFiltering(false);
    setSelectedBusinessType("");
    setSelectedCity("");
    setSelectedPriceRange("");
    setSelectedRentalTerm("");
    setSelectedBiznestScore("");
    setActiveDropdown(null);
  };

  return (
    <Pressable
      onPress={() => setIsVisibleFilterModal((prev) => !prev)}
      className="h-full w-full absolute bg-black/50 z-50 justify-center items-center"
    >
      <View
        className="bg-light-black w-[80%] elevation-lg shadow-black shadow-lg rounded-xl flex flex-col gap-3 p-3"
        onStartShouldSetResponder={() => true}
      >
        <View className="flex-row w-full justify-between items-center">
          <Text className="text-zinc-300 font-rBold text-2xl mb-1">Filter</Text>
          <TouchableOpacity
            onPress={() => setIsVisibleFilterModal(false)}
            className="bg-lighter-black rounded-full p-2"
          >
            <Image
              className="h-5 w-5"
              tintColor={"#71717a"}
              resizeMode="contain"
              source={icons.x}
            />
          </TouchableOpacity>
        </View>
        {/* 1st Row - Business Type & City */}
        <View className="w-full flex-row justify-between items-center">
          <CustomDropDown
            dropDownType="Business Type"
            dropDownList={businessTypes}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            stateVariable={selectedBusinessType}
            setStateVariable={setSelectedBusinessType}
          />
          <CustomDropDown
            dropDownType="City"
            dropDownList={cities}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            stateVariable={selectedCity}
            setStateVariable={setSelectedCity}
          />
        </View>
        <View className="w-full flex-row justify-between items-center">
          <CustomDropDown
            dropDownType="Price Range"
            dropDownList={priceRange}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            stateVariable={selectedPriceRange}
            setStateVariable={setSelectedPriceRange}
          />
          <CustomDropDown
            dropDownType="Rental Term"
            dropDownList={rentalTerm}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            stateVariable={selectedRentalTerm}
            setStateVariable={setSelectedRentalTerm}
          />
        </View>
        <View className="w-full flex-row justify-between items-center">
          <CustomDropDown
            dropDownType="Biznest Score"
            dropDownList={biznestScore}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            stateVariable={selectedBiznestScore}
            setStateVariable={setSelectedBiznestScore}
          />
        </View>
        <View className="w-full flex-row justify-between items-center mt-1.5">
          <View />
          <View className="flex-row gap-5 items-center">
            <TouchableOpacity onPress={clearStates}>
              <Text className="text-zinc-600">Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsFiltering(true);
                setIsVisibleFilterModal((prev) => !prev);
              }}
              className="bg-primary px-3 py-1 rounded-lg"
            >
              <Text className="font-rBold text-zinc-300 ">Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

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
        <ScrollView className="w-full absolute rounded-lg max-h-48 bg-lighter-black border border-zinc-500 top-9 py-2 z-[100]">
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
  );
}

export default FilterModal;
