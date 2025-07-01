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
  input,
  setInput,
  handleSearchedInput,
  width = "w-[80%]",
}: {
  input: string;
  width?: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSearchedInput: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => Promise<void>;
}) {
  return (
    <View
      className={`absolute self-center top-3 px-3 py-1 bg-zinc-700 rounded-full flex-row items-center elevation-lg border border-zinc-600 ${width}`}
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
      {input && (
        <TouchableOpacity onPress={() => setInput("")}>
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
