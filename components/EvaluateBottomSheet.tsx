import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useEvaluateBottomSheet } from "../context/evaluateBottomSheetContext";
import renderBackdrop from "./BottomSheetBackdrop";
import icons from "../constants/icons";
import { posts } from "../constants/data";
import { getRelativeTime } from "../utils/formatTime";
import { useState, useCallback, useEffect } from "react";
import api from "../configs/api";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import reverseGeocode from "../utils/reverseGeocode";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecentEval {
  amenityType: string;
  score: number;
  lat: number;
  lng: number;
  timestamp: number;
  result: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BUSINESS_TYPES: { label: string; emoji: string; value: string }[] = [
  { label: "Fast Food", emoji: "🍔", value: "fast food" },
  { label: "Convenience", emoji: "🏪", value: "convenience store" },
  { label: "Pharmacy", emoji: "💊", value: "pharmacy" },
  { label: "Grocery", emoji: "🛒", value: "grocery" },
  { label: "Bakery", emoji: "🥐", value: "bakery" },
  { label: "Salon", emoji: "💇", value: "salon" },
  { label: "Internet Café", emoji: "💻", value: "internet cafe" },
  { label: "Laundry", emoji: "👕", value: "laundry service" },
  { label: "Hardware", emoji: "🔧", value: "hardware store" },
  { label: "Gadgets", emoji: "📱", value: "gadgets store" },
  { label: "Pawnshop", emoji: "🔐", value: "pawnshop" },
  { label: "Medical", emoji: "🏥", value: "medical center" },
  { label: "Marketplace", emoji: "🏬", value: "marketplace" },
  { label: "Motorcycle", emoji: "🏍", value: "motorcycle shop" },
  { label: "Vape Shop", emoji: "💨", value: "vape shop" },
  { label: "Car Dealer", emoji: "🚗", value: "car dealer" },
];

const WEIGHT_META = {
  environment: { label: "Environment", emoji: "🏪", color: "#9d7ff4" },
  flood: { label: "Flood Risk", emoji: "🌊", color: "#4f9ef5" },
} as const;

const DEFAULT_WEIGHTS = { environment: 50, flood: 50 };

const SCORE_COLOR = (s: number) =>
  s >= 0.75 ? "#3ecf8e" : s >= 0.5 ? "#f5a623" : "#f06060";
const SCORE_LABEL = (s: number) =>
  s >= 0.75 ? "Great" : s >= 0.5 ? "Decent" : "Risky";

const RECENTS_KEY = "evaluate_recents_v1";

// ─── RecentRow ────────────────────────────────────────────────────────────────

function RecentRow({
  item,
  onPress,
}: {
  item: RecentEval;
  onPress: () => void;
}) {
  const bt = BUSINESS_TYPES.find((b) => b.value === item.amenityType);
  const color = SCORE_COLOR(item.score);
  const ago = getRelativeTime(new Date(item.timestamp).toISOString());
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.recentRow}
    >
      <View style={[styles.recentIcon, { backgroundColor: color + "1a" }]}>
        <Text style={{ fontSize: 16 }}>{bt?.emoji ?? "📍"}</Text>
      </View>
      <View style={styles.recentInfo}>
        <Text style={styles.recentType}>{bt?.label ?? item.amenityType}</Text>
        <Text style={styles.recentAgo}>{ago}</Text>
      </View>
      <View style={styles.recentRight}>
        <Text style={[styles.recentScore, { color }]}>
          {Math.round(item.score * 100)}%
        </Text>
        <Text style={[styles.recentBadge, { color }]}>
          {SCORE_LABEL(item.score)}
        </Text>
      </View>
      <Text style={styles.recentArrow}>›</Text>
    </TouchableOpacity>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function EvaluateBottomSheet() {
  const { evaluateBottomSheetRef, coords } = useEvaluateBottomSheet();
  const snapPoints = ["12%", "55%", "92%"];

  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [recents, setRecents] = useState<RecentEval[]>([]);

  // Independent sliders — each 0–100, no coupling
  const [weights, setWeights] = useState({ ...DEFAULT_WEIGHTS });

  const router = useRouter();
  const isBookmarked = !!bookmarkId;

  // The actual business type to evaluate: custom input wins if filled
  const activeBusinessType = showCustomInput
    ? customInput.trim()
    : selectedBusinessType;

  const totalWeight = weights.environment + weights.flood;
  const weightsOff = totalWeight !== 100;

  useEffect(() => {
    if (!coords) return;
    loadAddress();
    loadRecents();
  }, [coords?.lat, coords?.lng]);

  const loadAddress = async () => {
    if (!coords) return;
    setAddressLoading(true);
    try {
      const addr = await reverseGeocode(coords.lat, coords.lng);
      setAddress(addr || null);
    } catch {
      setAddress(null);
    } finally {
      setAddressLoading(false);
    }
  };

  const loadRecents = async () => {
    if (!coords) return;
    try {
      const raw = await AsyncStorage.getItem(RECENTS_KEY);
      if (!raw) return;
      const all: RecentEval[] = JSON.parse(raw);
      const nearby = all.filter(
        (r) =>
          Math.abs(r.lat - coords.lat) < 0.003 &&
          Math.abs(r.lng - coords.lng) < 0.003,
      );
      setRecents(nearby.slice(0, 3));
    } catch {
      setRecents([]);
    }
  };

  const saveRecent = async (
    amenityType: string,
    score: number,
    result: string,
  ) => {
    if (!coords) return;
    try {
      const raw = await AsyncStorage.getItem(RECENTS_KEY);
      const all: RecentEval[] = raw ? JSON.parse(raw) : [];
      const entry: RecentEval = {
        amenityType,
        score,
        lat: coords.lat,
        lng: coords.lng,
        timestamp: Date.now(),
        result,
      };
      const filtered = all.filter(
        (r) =>
          !(
            r.amenityType === amenityType &&
            Math.abs(r.lat - coords.lat) < 0.0005 &&
            Math.abs(r.lng - coords.lng) < 0.0005
          ),
      );
      await AsyncStorage.setItem(
        RECENTS_KEY,
        JSON.stringify([entry, ...filtered].slice(0, 20)),
      );
    } catch {}
  };

  const handleSheetChange = useCallback((index: number) => {
    if (index === -1) {
      setBookmarkId(null);
      setSelectedBusinessType("");
      setCustomInput("");
      setShowCustomInput(false);
      setAddress(null);
      setRecents([]);
      setWeights({ ...DEFAULT_WEIGHTS });
    }
  }, []);

  const handleBookmark = async () => {
    if (!coords) return;
    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await api.delete(`/api/v1/locations/bookmarks/${bookmarkId}`);
        setBookmarkId(null);
      } else {
        const { data } = await api.post("/api/v1/locations/bookmarks", {
          coords,
        });
        setBookmarkId(data.bookmarkId ?? data.bookmark?._id ?? "saved");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Could not update bookmark.",
        );
      } else {
        Alert.alert("Error", "Something went wrong.");
      }
    } finally {
      setBookmarkLoading(false);
    }
  };

  // Normalize weights to sum to 100 proportionally, then submit
  const handleEvaluate = async () => {
    if (!coords || !activeBusinessType) return;
    setEvaluating(true);
    console.log(coords);

    // Normalize so they always sum to 100 on submit
    const total = weights.environment + weights.flood;
    const wEnv = total > 0 ? weights.environment / total : 0.5;
    const wFld = total > 0 ? weights.flood / total : 0.5;

    try {
      const { data } = await api.post(
        `/api/v1/locations/score` +
          `?lat=${coords.lat}&lon=${coords.lng}` +
          `&amenityType=${encodeURIComponent(activeBusinessType)}` +
          `&wEnvironment=${wEnv.toFixed(3)}` +
          `&wFlood=${wFld.toFixed(3)}`,
      );

      const result = data.data;
      await saveRecent(
        activeBusinessType,
        result.finalScore,
        JSON.stringify(result),
      );
      evaluateBottomSheetRef.current?.close();

      router.push({
        pathname: "/(screens)/evaluateResult",
        params: {
          result: JSON.stringify(result),
          amenityType: activeBusinessType,
          lat: String(coords.lat),
          lng: String(coords.lng),
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Could not evaluate location.",
        );
      } else {
        Alert.alert("Error", "Something went wrong.");
      }
    } finally {
      setEvaluating(false);
    }
  };

  const handleRecentPress = (item: RecentEval) => {
    evaluateBottomSheetRef.current?.close();
    router.push({
      pathname: "/(screens)/evaluateResult",
      params: {
        result: item.result,
        amenityType: item.amenityType,
        lat: String(item.lat),
        lng: String(item.lng),
      },
    });
  };

  const selectedBt = BUSINESS_TYPES.find(
    (b) => b.value === selectedBusinessType,
  );
  const canEvaluate = !!activeBusinessType && !evaluating;

  return (
    <BottomSheet
      ref={evaluateBottomSheetRef}
      enablePanDownToClose
      backdropComponent={(props) => renderBackdrop(props, 0.3)}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: "#525252" }}
      backgroundStyle={{ backgroundColor: "#131213" }}
      index={-1}
      enableContentPanningGesture={false}
      onChange={handleSheetChange}
    >
      <BottomSheetScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ───────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Location Overview</Text>
            {addressLoading ? (
              <View style={styles.addressRow}>
                <ActivityIndicator size={10} color="#525252" />
                <Text style={styles.addressLoading}>Resolving address…</Text>
              </View>
            ) : address ? (
              <View style={styles.addressRow}>
                <Text style={styles.addressPin}>📍</Text>
                <Text style={styles.addressText} numberOfLines={1}>
                  {address}
                </Text>
              </View>
            ) : coords ? (
              <Text style={styles.coordsText}>
                {coords.lat.toFixed(5)}° N, {coords.lng.toFixed(5)}° E
              </Text>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={handleBookmark}
            disabled={bookmarkLoading}
            style={[
              styles.bookmarkBtn,
              isBookmarked ? styles.bookmarkActive : styles.bookmarkIdle,
            ]}
          >
            {bookmarkLoading ? (
              <ActivityIndicator size="small" color="#d4d4d8" />
            ) : (
              <Image
                source={icons.bookmark}
                tintColor={isBookmarked ? "#fff" : "#848483"}
                style={styles.bookmarkIcon}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* ── Business Type ─────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Business Type</Text>
          {(selectedBusinessType || customInput) && (
            <TouchableOpacity
              onPress={() => {
                setSelectedBusinessType("");
                setCustomInput("");
                setShowCustomInput(false);
              }}
            >
              <Text style={styles.clearBtn}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Chip grid */}
        <View style={styles.businessGrid}>
          {BUSINESS_TYPES.map((bt) => {
            const isSelected =
              !showCustomInput && selectedBusinessType === bt.value;
            return (
              <TouchableOpacity
                key={bt.value}
                onPress={() => {
                  setShowCustomInput(false);
                  setCustomInput("");
                  setSelectedBusinessType(isSelected ? "" : bt.value);
                }}
                activeOpacity={0.75}
                style={[
                  styles.businessTile,
                  isSelected
                    ? styles.businessTileSelected
                    : styles.businessTileIdle,
                ]}
              >
                <Text style={styles.businessEmoji}>{bt.emoji}</Text>
                <Text
                  style={[
                    styles.businessLabel,
                    { color: isSelected ? "#fff" : "#71717a" },
                  ]}
                  numberOfLines={1}
                >
                  {bt.label}
                </Text>
                {isSelected && (
                  <View style={styles.businessCheck}>
                    <Text style={{ fontSize: 8, color: "#fff" }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {/* "Other" tile to toggle manual input */}
          <TouchableOpacity
            onPress={() => {
              setShowCustomInput(true);
              setSelectedBusinessType("");
            }}
            activeOpacity={0.75}
            style={[
              styles.businessTile,
              showCustomInput
                ? styles.businessTileSelected
                : styles.businessTileIdle,
            ]}
          >
            <Text style={styles.businessEmoji}>✏️</Text>
            <Text
              style={[
                styles.businessLabel,
                { color: showCustomInput ? "#fff" : "#71717a" },
              ]}
            >
              Other
            </Text>
          </TouchableOpacity>
        </View>

        {/* Manual input — shown when "Other" is tapped */}
        {showCustomInput && (
          <View style={styles.customInputWrapper}>
            <TextInput
              style={styles.customInput}
              placeholder="e.g. Sari-sari store, Pet Shop…"
              placeholderTextColor="#52525b"
              value={customInput}
              onChangeText={setCustomInput}
              autoFocus
              returnKeyType="done"
            />
            {customInput.length > 0 && (
              <TouchableOpacity
                onPress={() => setCustomInput("")}
                style={styles.customClear}
              >
                <Text style={{ color: "#52525b", fontSize: 13 }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ── Score Priorities ──────────────────────────────────────── */}
        <View style={[styles.sectionHeader]}>
          <Text style={styles.sectionTitle}>Score Priorities</Text>
          <TouchableOpacity onPress={() => setWeights({ ...DEFAULT_WEIGHTS })}>
            <Text style={styles.clearBtn}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weightsCard}>
          <Text style={styles.weightsHint}>
            Set how much each factor matters. They're independent — on evaluate
            they'll be normalized automatically.
          </Text>

          {(Object.keys(weights) as (keyof typeof weights)[]).map((key) => {
            const meta = WEIGHT_META[key];
            return (
              <View key={key} style={styles.sliderRow}>
                <View style={styles.sliderMeta}>
                  <Text style={styles.sliderEmoji}>{meta.emoji}</Text>
                  <Text style={styles.sliderLabel}>{meta.label}</Text>
                  <View
                    style={[
                      styles.sliderBadge,
                      {
                        backgroundColor: meta.color + "22",
                        borderColor: meta.color + "55",
                      },
                    ]}
                  >
                    <Text
                      style={[styles.sliderBadgeText, { color: meta.color }]}
                    >
                      {weights[key]}%
                    </Text>
                  </View>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  step={1}
                  value={weights[key]}
                  onValueChange={(v) =>
                    setWeights((prev) => ({ ...prev, [key]: v }))
                  }
                  minimumTrackTintColor={meta.color}
                  maximumTrackTintColor="#27272a"
                  thumbTintColor={meta.color}
                />
              </View>
            );
          })}

          {/* Proportional bar */}
          <View style={styles.weightBar}>
            {(Object.keys(weights) as (keyof typeof weights)[]).map((key) => (
              <View
                key={key}
                style={[
                  styles.weightBarSegment,
                  {
                    flex: weights[key] || 0.5,
                    backgroundColor: WEIGHT_META[key].color,
                  },
                ]}
              />
            ))}
          </View>

          {weightsOff && (
            <Text style={styles.weightsSumNote}>
              Total: {totalWeight}% — will be normalized to 100% on evaluate
            </Text>
          )}
        </View>

        {/* ── Recent Evaluations ────────────────────────────────────── */}
        {recents.length > 0 && (
          <>
            <View style={[styles.sectionHeader, { marginTop: 8 }]}>
              <Text style={styles.sectionTitle}>Recent Evaluations</Text>
              <Text style={styles.sectionCount}>
                {recents.length} result{recents.length !== 1 ? "s" : ""}
              </Text>
            </View>
            <View style={styles.recentsCard}>
              {recents.map((item, i) => (
                <View key={i}>
                  <RecentRow
                    item={item}
                    onPress={() => handleRecentPress(item)}
                  />
                  {i < recents.length - 1 && (
                    <View style={styles.recentDivider} />
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        {/* ── Evaluate Button — at the end of scroll ────────────────── */}
        <View style={styles.evaluateSection}>
          {!activeBusinessType && (
            <Text style={styles.evaluateHint}>
              Select or type a business type above
            </Text>
          )}
          <TouchableOpacity
            onPress={handleEvaluate}
            disabled={!canEvaluate}
            activeOpacity={0.85}
            style={[
              styles.evaluateBtn,
              canEvaluate
                ? styles.evaluateBtnActive
                : styles.evaluateBtnDisabled,
            ]}
          >
            {evaluating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                {selectedBt && !showCustomInput ? (
                  <Text style={styles.evaluateBtnEmoji}>
                    {selectedBt.emoji}
                  </Text>
                ) : null}
                <Text
                  style={[
                    styles.evaluateBtnText,
                    !canEvaluate && styles.evaluateBtnTextDisabled,
                  ]}
                >
                  {evaluating
                    ? "Evaluating…"
                    : activeBusinessType
                      ? `Evaluate for ${activeBusinessType}`
                      : "Evaluate Location"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContent: { paddingTop: 8, paddingBottom: 350 },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerLeft: { flex: 1, marginRight: 12 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e4e4e7",
    letterSpacing: -0.3,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  addressPin: { fontSize: 11 },
  addressText: { fontSize: 12, color: "#71717a", flex: 1 },
  addressLoading: { fontSize: 11, color: "#52525b", marginLeft: 4 },
  coordsText: { fontSize: 11, color: "#52525b", marginTop: 3 },
  bookmarkBtn: {
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkActive: { backgroundColor: "#6856CF" },
  bookmarkIdle: { backgroundColor: "#27272a" },
  bookmarkIcon: { width: 18, height: 18 },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#52525b",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  sectionCount: { fontSize: 11, color: "#52525b" },
  clearBtn: { fontSize: 12, color: "#6856CF", fontWeight: "600" },

  businessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 12,
  },
  businessTile: {
    width: "22%",
    aspectRatio: 0.9,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 4,
    position: "relative",
  },
  businessTileSelected: {
    backgroundColor: "#6856CF22",
    borderColor: "#6856CF",
  },
  businessTileIdle: { backgroundColor: "#1c1c1e", borderColor: "#27272a" },
  businessEmoji: { fontSize: 22 },
  businessLabel: { fontSize: 9, fontWeight: "500", textAlign: "center" },
  businessCheck: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#6856CF",
    alignItems: "center",
    justifyContent: "center",
  },

  customInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#1c1c1e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#6856CF",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  customInput: {
    flex: 1,
    fontSize: 14,
    color: "#e4e4e7",
  },
  customClear: { padding: 4 },

  weightsCard: {
    marginHorizontal: 16,
    backgroundColor: "#1c1c1e",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#27272a",
    padding: 14,
    gap: 12,
    marginBottom: 20,
  },
  weightsHint: { fontSize: 11, color: "#52525b", lineHeight: 16 },
  sliderRow: { gap: 4 },
  sliderMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  sliderEmoji: { fontSize: 14 },
  sliderLabel: { fontSize: 12, fontWeight: "600", color: "#a1a1aa", flex: 1 },
  sliderBadge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  sliderBadgeText: { fontSize: 11, fontWeight: "700" },
  slider: { width: "100%", height: 36 },
  weightBar: {
    flexDirection: "row",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    gap: 2,
  },
  weightBarSegment: { borderRadius: 3 },
  weightsSumNote: {
    fontSize: 11,
    color: "#f5a623",
    textAlign: "center",
    marginTop: 4,
  },

  recentsCard: {
    marginHorizontal: 16,
    backgroundColor: "#1c1c1e",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#27272a",
    overflow: "hidden",
    marginBottom: 4,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  recentIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  recentInfo: { flex: 1 },
  recentType: { fontSize: 13, fontWeight: "600", color: "#d4d4d8" },
  recentAgo: { fontSize: 10, color: "#52525b", marginTop: 1 },
  recentRight: { alignItems: "flex-end" },
  recentScore: { fontSize: 14, fontWeight: "700" },
  recentBadge: { fontSize: 9, fontWeight: "500", marginTop: 1 },
  recentArrow: { fontSize: 18, color: "#3f3f46", marginLeft: 4 },
  recentDivider: {
    height: 1,
    backgroundColor: "#27272a",
    marginHorizontal: 14,
  },

  listingsRow: { paddingHorizontal: 16, gap: 12 },
  listingCard: {
    width: 200,
    backgroundColor: "#1c1c1e",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#27272a",
    overflow: "hidden",
  },
  listingImage: { width: "100%", height: 110 },
  listingBody: { padding: 10, gap: 4 },
  listingTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listingUser: { fontSize: 12, fontWeight: "600", color: "#d4d4d8", flex: 1 },
  listingAge: { fontSize: 10, color: "#52525b" },
  listingPrice: { fontSize: 14, fontWeight: "700", color: "#a1a1aa" },
  listingFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  distancePill: {
    borderWidth: 1,
    borderColor: "#6856CF80",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  distanceText: { fontSize: 10, color: "#6856CF", fontWeight: "600" },
  viewPost: { fontSize: 11, color: "#52525b", fontWeight: "500" },

  evaluateSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 8,
  },
  evaluateHint: { fontSize: 12, color: "#52525b", textAlign: "center" },
  evaluateBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  evaluateBtnActive: { backgroundColor: "#22c55e" },
  evaluateBtnDisabled: {
    backgroundColor: "#1c1c1e",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  evaluateBtnEmoji: { fontSize: 18 },
  evaluateBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  evaluateBtnTextDisabled: { color: "#3f3f46" },
});

export default EvaluateBottomSheet;
