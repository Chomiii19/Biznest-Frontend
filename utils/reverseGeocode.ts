import * as Location from "expo-location";

const reverseGeocode = async (latitude: number, longitude: number) => {
  try {
    const addressArray = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (addressArray.length > 0) {
      const address = addressArray[0];
      return `${address.name}, ${address.street}, ${address.city}, ${address.region}`;
    } else {
      return "No address found";
    }
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Error getting address";
  }
};

export default reverseGeocode;
