import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from "react-native";
import icons from "../constants/icons";
import { router } from "expo-router";

function SearchBar({
  input,
  setInput,
  handleSearchedInput,
  width,
  position,
  top,
}: {
  input: string;
  width: string;
  position: string;
  top: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSearchedInput: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => Promise<void>;
}) {
  return (
    <View
      className={`self-center px-3 py-1 bg-zinc-700 rounded-full flex-row items-center elevation-lg border border-zinc-600 ${width} ${position} ${top}`}
    >
      <Image
        source={icons.search}
        className="h-5 w-5 -scale-x-[1]"
        tintColor={"#848483"}
        resizeMode="contain"
      />
      <TextInput
        scrollEnabled
        placeholder="Search a location..."
        onChangeText={setInput}
        value={input}
        placeholderTextColor={"#848483"}
        onSubmitEditing={handleSearchedInput}
        className="flex-1 font-rRegular text-zinc-300 mx-2"
      />
      {input ? (
        <TouchableOpacity onPress={() => setInput("")}>
          <Image
            source={icons.x}
            className="h-4 w-4"
            tintColor={"#848483"}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => router.push("/(screens)/bookmarks")}>
          <Image
            source={icons.bookmark}
            className="h-5 w-5"
            tintColor={"#848483"}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default SearchBar;
