import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from "react-native";
import React, { useEffect, useRef, useState, useCallback } from "react";
import MapView, {
  LongPressEvent,
  MapPressEvent,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mapTileStyleDark } from "../../styles/mapTileStyle";
import SearchBar from "../../components/SearchBar";
import { ICoords } from "../../@types/interfaces";
import reverseGeocode from "../../utils/reverseGeocode";
import icons from "../../constants/icons";
import { useEvaluateBottomSheet } from "../../context/evaluateBottomSheetContext";
import forwardGeocoding from "../../utils/forwardGeocode";
import ShowUserLocation from "../../components/ShowUserLocation";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import api from "../../configs/api";

// ─── Storage keys ─────────────────────────────────────────────────────────────
const EVAL_RESULTS_KEY = "evaluate_results_v1";
const RECENTS_KEY = "evaluate_recents_v1";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoredEvalResult {
  amenityType: string;
  finalScore: number;
  lat: number;
  lng: number;
  timestamp: number;
}

interface StoredBookmark {
  _id: string;
  coords: { lat: number; lng: number };
  notes?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AMENITY_EMOJI: Record<string, string> = {
  "fast food": "🍔",
  "convenience store": "🏪",
  pawnshop: "🔐",
  "internet cafe": "💻",
  salon: "💇",
  bakery: "🥐",
  "car dealer": "🚗",
  "gadgets store": "📱",
  grocery: "🛒",
  "laundry service": "👕",
  marketplace: "🏬",
  "medical center": "🏥",
  "motorcycle shop": "🏍",
  "vape shop": "💨",
  "hardware store": "🔧",
  pharmacy: "💊",
};

const SCORE_BORDER = (s: number) =>
  s >= 0.75 ? "#3ecf8e" : s >= 0.5 ? "#f5a623" : "#f06060";

const INITIAL_REGION = {
  latitude: 14.5995,
  longitude: 120.9842,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const Evaluate = () => {
  const mapRef = useRef<MapView | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ICoords | null>(
    null,
  );
  const [address, setAddress] = useState("");
  const { openBottomSheet } = useEvaluateBottomSheet();
  const params = useLocalSearchParams<{ lat?: string; lng?: string }>();

  const [evalResults, setEvalResults] = useState<StoredEvalResult[]>([]);
  const [bookmarks, setBookmarks] = useState<StoredBookmark[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadEvalResults();
      loadBookmarks();
    }, []),
  );

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      focusUserLocation();
    })();
  }, []);

  useEffect(() => {
    if (!params.lat || !params.lng) return;
    const lat = parseFloat(params.lat);
    const lng = parseFloat(params.lng);
    setSelectedLocation({ latitude: lat, longitude: lng });
    animateTo(lat, lng);
    openBottomSheet({ lat, lng });
  }, [params.lat, params.lng]);

  const loadEvalResults = async () => {
    try {
      const raw = await AsyncStorage.getItem(EVAL_RESULTS_KEY);
      const recentsRaw = await AsyncStorage.getItem(RECENTS_KEY);

      const stored: StoredEvalResult[] = raw ? JSON.parse(raw) : [];

      if (recentsRaw) {
        const recents = JSON.parse(recentsRaw) as {
          amenityType: string;
          score: number;
          lat: number;
          lng: number;
          timestamp: number;
        }[];
        recents.forEach((r) => {
          const exists = stored.some(
            (s) =>
              s.amenityType === r.amenityType &&
              Math.abs(s.lat - r.lat) < 0.0005 &&
              Math.abs(s.lng - r.lng) < 0.0005,
          );
          if (!exists) {
            stored.push({
              amenityType: r.amenityType,
              finalScore: r.score,
              lat: r.lat,
              lng: r.lng,
              timestamp: r.timestamp,
            });
          }
        });
      }

      setEvalResults(stored);
    } catch {
      setEvalResults([]);
    }
  };

  const loadBookmarks = async () => {
    try {
      const { data } = await api.get("/api/v1/locations/bookmarks");
      setBookmarks(data.bookmarks ?? []);
    } catch {
      setBookmarks([]);
    }
  };

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
      500,
    );
  };

  const handleSearchedLocation = async (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    const result = await forwardGeocoding(e.nativeEvent.text);
    if (!result) return;
    setSelectedLocation(result);
    setAddress(await reverseGeocode(result.latitude, result.longitude));
    openBottomSheet({ lat: result.latitude, lng: result.longitude });
    animateTo(result.latitude, result.longitude);
  };

  const handleSelectedLocation = async (e: MapPressEvent | LongPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    setAddress(await reverseGeocode(latitude, longitude));
    openBottomSheet({ lat: latitude, lng: longitude });
    animateTo(latitude, longitude);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1">
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          onPress={handleSelectedLocation}
          onLongPress={handleSelectedLocation}
          customMapStyle={mapTileStyleDark}
          userInterfaceStyle="dark"
          initialRegion={INITIAL_REGION}
          showsCompass={false}
          showsBuildings
          showsUserLocation
          showsMyLocationButton={false}
        >
          {/* ── Selected location pin ──────────────────────────── */}
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              image={icons["pin-fill2"]}
              style={{ height: 5, width: 5 }}
            />
          )}

          {/* ── Eval result pins ───────────────────────────────── */}
          {evalResults.map((result, i) => {
            const borderColor = SCORE_BORDER(result.finalScore);
            const emoji = AMENITY_EMOJI[result.amenityType] ?? "📍";
            return (
              <Marker
                key={`eval-${i}`}
                coordinate={{ latitude: result.lat, longitude: result.lng }}
                anchor={{ x: 0.5, y: 1 }}
                onPress={() =>
                  openBottomSheet({ lat: result.lat, lng: result.lng })
                }
              >
                <View style={pinStyles.wrapper}>
                  <View style={[pinStyles.bubble, { borderColor }]}>
                    <Text style={{ fontSize: 16 }}>{emoji}</Text>
                  </View>
                  <View
                    style={[pinStyles.tail, { borderTopColor: borderColor }]}
                  />
                  <View
                    style={[pinStyles.dot, { backgroundColor: borderColor }]}
                  />
                </View>
              </Marker>
            );
          })}

          {/* ── Bookmark pins — unchanged ──────────────────────── */}
          {bookmarks.map((bm) => (
            <Marker
              key={`bm-${bm._id}`}
              coordinate={{
                latitude: bm.coords.lat,
                longitude: bm.coords.lng,
              }}
              anchor={{ x: 0.5, y: 1 }}
              onPress={() =>
                openBottomSheet({ lat: bm.coords.lat, lng: bm.coords.lng })
              }
            >
              <View style={pinStyles.wrapper}>
                <View style={pinStyles.bmBubble}>
                  <Text style={{ fontSize: 13 }}>🔖</Text>
                </View>
                <View style={pinStyles.bmTail} />
                <View style={pinStyles.bmDot} />
              </View>
            </Marker>
          ))}
        </MapView>

        <SearchBar
          input={address}
          setInput={setAddress}
          handleSearchedInput={handleSearchedLocation}
          width="w-[80%]"
          position="absolute"
          top="top-3"
        />
        <ShowUserLocation focusUserLocation={focusUserLocation} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  map: { width: "100%", height: "100%" },
});

const pinStyles = StyleSheet.create({
  // shared wrapper
  wrapper: {
    alignItems: "center",
  },

  // eval bubble — same shape as bookmark but score-colored border
  bubble: {
    backgroundColor: "#131215",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: -1,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 2,
  },

  // bookmark bubble
  bmBubble: {
    backgroundColor: "#1a1730",
    borderWidth: 1.5,
    borderColor: "#6856CF",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 5,
    shadowColor: "#6856CF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  bmTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#6856CF",
    marginTop: -1,
  },
  bmDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#6856CF",
    marginTop: 2,
  },
});

export default Evaluate;
