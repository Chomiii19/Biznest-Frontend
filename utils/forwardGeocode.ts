import * as Location from "expo-location";

const forwardGeocoding = async (
  address: string
): Promise<Location.LocationGeocodedLocation | null> => {
  try {
    const geocodedLocation = await Location.geocodeAsync(address);

    if (geocodedLocation.length > 0) return geocodedLocation[0];
    else return null;
  } catch (error) {
    console.error("Forwarded geocoding error:", error);
    return null;
  }
};

export default forwardGeocoding;
