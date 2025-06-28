import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { mapTileStyleLight, mapTileStyleDark } from "../../styles/mapTileStyle";
import { router } from "expo-router";
import icons from "../../constants/icons";
import { ICoords } from "../../@types/interfaces";
import reverseGeocode from "../../utils/reverseGeocode";

const SelectLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [selectedLocation, setSelectedLocation] = useState<ICoords | null>(
    null
  );
  const [address, setAddress] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const handleSelectedLocation = async (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const reverseGeocodedAddress = await reverseGeocode(latitude, longitude);
    setSelectedLocation({ latitude, longitude });
    setAddress(reverseGeocodedAddress);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-backgroundColor">
        <Header address={address} />
        <View className="flex-1">
          <MapView
            onPress={handleSelectedLocation}
            provider="google"
            style={styles.map}
            customMapStyle={mapTileStyleDark}
            userInterfaceStyle="dark"
            initialRegion={{
              latitude: location?.coords.latitude ?? 14.5869,
              longitude: location?.coords.longitude ?? 120.9832,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            }}
            showsCompass
            showsUserLocation
            // showsBuildings
            // showsTraffic
            showsMyLocationButton={false}
          >
            {selectedLocation && (
              <Marker
                coordinate={selectedLocation}
                image={icons["pin-fill2"]}
                style={{
                  height: 5,
                  width: 5,
                }}
              />
            )}
          </MapView>

          <SearchBar address={address} setAddress={setAddress} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

function SearchBar({
  address,
  setAddress,
}: {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <View className="absolute self-center top-3 w-[80%] px-3 py-1 bg-zinc-700 rounded-full flex-row items-center elevation-lg">
      <Image
        source={icons.search}
        className="h-5 w-5 -scale-x-[1]"
        tintColor={"#848483"}
        resizeMode="contain"
      />
      <TextInput
        placeholder="Search a location..."
        onChangeText={setAddress}
        value={address}
        placeholderTextColor={"#848483"}
        className="flex-1 border-r border-r-zinc-600 font-rRegular text-zinc-300 mx-2"
      />
      <Image
        source={icons.bookmark}
        className="h-5 w-5"
        tintColor={"#848483"}
        resizeMode="contain"
      />
    </View>
  );
}

function Header({ address }: { address: string }) {
  return (
    <View className="w-full flex-row justify-between items-center px-4 p-2">
      <View className="flex-row gap-1 items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={icons.next}
            className="h-7 w-7 -scale-x-[1]"
            resizeMode="contain"
            tintColor={"#d4d4d8"}
          />
        </TouchableOpacity>
        <Text className="text-zinc-300 font-rBold text-2xl">
          Select Location
        </Text>
      </View>

      <TouchableOpacity
        className={`px-3 py-1 rounded-lg bg-primary ${address ? "bg-primary" : "bg-zinc-800/80"}`}
        onPress={() =>
          router.replace({
            pathname: "/createPost",
            params: { selectedAddress: address },
          })
        }
      >
        <Text
          className={`font-rSemibold text-sm ${address ? "text-zinc-300" : "text-zinc-500"}`}
        >
          Select
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});

export default SelectLocation;
