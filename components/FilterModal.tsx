import React, { useState } from "react";
import { Pressable, View, Text, Image, TouchableOpacity } from "react-native";
import {
  biznestScore,
  businessTypes,
  cities,
  priceRange,
  rentalTerm,
} from "../constants/data";
import icons from "../constants/icons";
import CustomDropDown from "./CustomDropDown";

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

export default FilterModal;
