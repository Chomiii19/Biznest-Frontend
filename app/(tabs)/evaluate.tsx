import { View, Text, StyleSheet } from "react-native";
import React from "react";
import MapView from "react-native-maps";
import { mapTileStyleLight, mapTileStyleDark } from "../../styles/mapTileStyle";

const Evaluate = () => {
  return (
    <View>
      <MapView
        provider="google"
        style={styles.map}
        customMapStyle={mapTileStyleDark}
        userInterfaceStyle="dark"
        initialRegion={{
          latitude: 14.5869,
          longitude: 120.9832,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
        showsCompass={false}
        showsUserLocation
        // showsBuildings
        // showsTraffic
        showsMyLocationButton
      />
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Evaluate;
