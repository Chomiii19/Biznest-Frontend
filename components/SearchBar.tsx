import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from "react-native";
import icons from "../constants/icons";

function SearchBar({
  address,
  setAddress,
  handleSearchedLocation,
}: {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  handleSearchedLocation: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => Promise<void>;
}) {
  return (
    <View className="absolute self-center top-3 w-[80%] px-3 py-1 bg-zinc-700 rounded-full flex-row items-center elevation-lg border border-zinc-600">
      <Image
        source={icons.search}
        className="h-5 w-5 -scale-x-[1]"
        tintColor={"#848483"}
        resizeMode="contain"
      />
      <TextInput
        scrollEnabled
        placeholder="Search a location..."
        onChangeText={setAddress}
        value={address}
        placeholderTextColor={"#848483"}
        onSubmitEditing={handleSearchedLocation}
        className="flex-1 font-rRegular text-zinc-300 mx-2"
      />
      {address && (
        <TouchableOpacity onPress={() => setAddress("")}>
          <Image
            source={icons.x}
            className="h-4 w-4"
            tintColor={"#848483"}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default SearchBar;
