import { TouchableOpacity, Image } from "react-native";
import icons from "../constants/icons";

function ShowUserLocation({
  focusUserLocation,
}: {
  focusUserLocation: () => Promise<void>;
}) {
  return (
    <TouchableOpacity
      onPress={focusUserLocation}
      className="bg-zinc-700 rounded-full border border-zinc-600 p-2 absolute bottom-24 right-6 elevation-md"
    >
      <Image
        source={icons.gps}
        className="h-5 w-5 -scale-x-[1]"
        tintColor={"#848483"}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

export default ShowUserLocation;
