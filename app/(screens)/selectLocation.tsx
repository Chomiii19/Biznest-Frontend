import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, {
  LongPressEvent,
  MapPressEvent,
  Marker,
} from "react-native-maps";
import * as Location from "expo-location";
import { mapTileStyleLight, mapTileStyleDark } from "../../styles/mapTileStyle";
import { router } from "expo-router";
import icons from "../../constants/icons";
import { ICoords } from "../../@types/interfaces";
import reverseGeocode from "../../utils/reverseGeocode";
import SearchBar from "../../components/SearchBar";
import forwardGeocoding from "../../utils/forwardGeocode";
import ShowUserLocation from "../../components/ShowUserLocation";

const SelectLocation = () => {
  const mapRef = useRef<MapView | null>(null);
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

      focusUserLocation();
    })();
  }, []);

  const focusUserLocation = async () => {
    const { coords } = await Location.getCurrentPositionAsync({});
    animateTo(coords.latitude, coords.longitude);
  };

  const animateTo = (lat: number, lng: number) => {
    mapRef.current?.animateToRegion(
      {
        latitude: lat - 0.0003,
        longitude: lng,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      },
      500
    );
  };

  const handleSearchedLocation = async (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    const result = await forwardGeocoding(e.nativeEvent.text);
    if (!result) return;
    setSelectedLocation(result);
    animateTo(result.latitude, result.longitude);
  };

  const handleSelectedLocation = async (e: MapPressEvent | LongPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    setAddress(await reverseGeocode(latitude, longitude));
    animateTo(latitude, longitude);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-backgroundColor">
        <Header address={address} />
        <View className="flex-1">
          <MapView
            ref={mapRef}
            onPress={handleSelectedLocation}
            provider="google"
            style={styles.map}
            customMapStyle={mapTileStyleDark}
            userInterfaceStyle="dark"
            initialRegion={{
              latitude: 14.5995,
              longitude: 120.9842,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            showsCompass
            showsUserLocation
            showsBuildings
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

          <SearchBar
            address={address}
            setAddress={setAddress}
            handleSearchedLocation={handleSearchedLocation}
          />
          <ShowUserLocation focusUserLocation={focusUserLocation} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

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
