import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
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
import SearchBar from "../../components/SearchBar";
import { ICoords } from "../../@types/interfaces";
import reverseGeocode from "../../utils/reverseGeocode";
import icons from "../../constants/icons";
import { useEvaluateBottomSheet } from "../../context/evaluateBottomSheetContext";
import forwardGeocoding from "../../utils/forwardGeocode";
import ShowUserLocation from "../../components/ShowUserLocation";

const INITIAL_REGION = {
  latitude: 14.5995,
  longitude: 120.9842,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const Evaluate = () => {
  const mapRef = useRef<MapView | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ICoords | null>(
    null
  );
  const [address, setAddress] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { openBottomSheet } = useEvaluateBottomSheet();

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
    setAddress(await reverseGeocode(result.latitude, result.longitude));
    openBottomSheet();
    animateTo(result.latitude, result.longitude);
  };

  const handleSelectedLocation = async (e: MapPressEvent | LongPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    setAddress(await reverseGeocode(latitude, longitude));
    openBottomSheet();
    animateTo(latitude, longitude);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1">
        <MapView
          ref={mapRef}
          provider="google"
          style={styles.map}
          onPress={handleSelectedLocation}
          onLongPress={handleSelectedLocation}
          customMapStyle={mapTileStyleDark}
          userInterfaceStyle="dark"
          initialRegion={INITIAL_REGION}
          showsCompass={false}
          showsBuildings
          showsUserLocation
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
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Evaluate;
