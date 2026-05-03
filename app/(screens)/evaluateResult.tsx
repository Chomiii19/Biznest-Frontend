import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import icons from "../../constants/icons";
import { mapTileStyleDark } from "../../styles/mapTileStyle";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TopFactor {
  amenity: string;
  count: number;
  relevance: number;
}

interface FactorLocation {
  index: number;
  lat: number;
  lon: number;
}

interface DominantAmenity {
  amenity: string;
  centroid_weight: number;
}

interface BestCluster {
  cluster_id: number;
  similarity: number;
  dominant_amenities: DominantAmenity[];
  label: string;
}

interface FactorContribution {
  amenity: string;
  normalized_contribution: number;
  explanation: string;
}

interface EnvironmentDetails {
  amenity: string;
  similarity_score: number;
  best_cluster: BestCluster;
  top_factors: TopFactor[];
  factor_locations: Record<string, FactorLocation[]>;
  breakdown: {
    score_decomposition: { interpretation: string };
    factor_contributions: FactorContribution[];
  };
}

interface EvaluateResult {
  finalScore: number;
  floodScore: number;
  environmentScore: number;
  details: {
    environment: EnvironmentDetails;
    flood: {
      flood_risk_score: number;
      lat: number;
      lon: number;
    };
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AMENITY_ICONS: Record<string, string> = {
  "fast food": "🍔",
  "convenience store": "🏪",
  pawnshope: "🔐",
  pawnshop: "🔐",
  "internet cafe": "💻",
  salon: "💇",
  bakery: "🥐",
  school: "🏫",
  "bus station": "🚌",
  "car dealer": "🚗",
  "gadgets store": "📱",
  "grocery story": "🛒",
  grocery: "🛒",
  "laundry service": "👕",
  marketplace: "🏬",
  "medical center": "🏥",
  motorcycle: "🏍",
  "motorcycle shop": "🏍",
  "vape shop": "💨",
  "hardware store": "🔧",
  pharmacy: "💊",
  restaurant: "🍽",
  "coffee shop": "☕",
  "clothing store": "👗",
  hotel: "🏨",
  hostel: "🛏",
  pub: "🍺",
  "bar and grill": "🍖",
};

const RELEVANCE_COLORS = [
  "#f06060",
  "#4f9ef5",
  "#f5a623",
  "#3ecf8e",
  "#9d7ff4",
];

// ─── ScoreRing ────────────────────────────────────────────────────────────────

function ScoreRing({
  score,
  amenityType,
}: {
  score: number;
  amenityType: string;
}) {
  const animVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: score,
      duration: 1400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [score]);

  const SIZE = 120;
  const pct = Math.round(score * 100);
  const scoreColor =
    score >= 0.75 ? "#3ecf8e" : score >= 0.5 ? "#f5a623" : "#f06060";
  const label =
    score >= 0.75
      ? "Great Location"
      : score >= 0.5
        ? "Decent Location"
        : "Risky Location";

  return (
    <View style={styles.ringContainer}>
      <View style={styles.ringWrapper}>
        <View
          style={[
            styles.ringBg,
            {
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2,
              borderColor: "#2a2735",
            },
          ]}
        />
        <View style={styles.ringInner}>
          <Text style={[styles.ringScore, { color: scoreColor }]}>{pct}%</Text>
          <Text style={styles.ringLabel}>Overall</Text>
        </View>
      </View>
      <View style={styles.ringInfo}>
        <Text style={styles.ringTitle}>{label}</Text>
      </View>
    </View>
  );
}

// ─── SubScorePill ─────────────────────────────────────────────────────────────

function SubScorePill({
  label,
  value,
  color,
  display,
}: {
  label: string;
  value: number;
  color: string;
  display: string;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value,
      duration: 1200,
      delay: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <View style={styles.pill}>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={[styles.pillValue, { color }]}>{display}</Text>
      <View style={styles.pillTrack}>
        <Animated.View
          style={[
            styles.pillFill,
            {
              backgroundColor: color,
              width: anim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

// ─── FactorRow ────────────────────────────────────────────────────────────────

function FactorRow({ factor, index }: { factor: TopFactor; index: number }) {
  const color = RELEVANCE_COLORS[index % RELEVANCE_COLORS.length];
  const icon = AMENITY_ICONS[factor.amenity.toLowerCase()] ?? "📍";
  const pct = Math.round(factor.relevance * 100);

  return (
    <View style={styles.factorRow}>
      <View style={[styles.factorIcon, { backgroundColor: color + "1a" }]}>
        <Text style={{ fontSize: 16 }}>{icon}</Text>
      </View>
      <View style={styles.factorInfo}>
        <Text style={styles.factorName} numberOfLines={1}>
          {factor.amenity.charAt(0).toUpperCase() + factor.amenity.slice(1)}
        </Text>
        <Text style={styles.factorCount}>{factor.count} nearby</Text>
      </View>
      <View style={styles.factorRight}>
        <Text style={[styles.factorPct, { color }]}>{pct}%</Text>
        <View style={styles.factorTrack}>
          <View
            style={[
              styles.factorFill,
              { width: `${pct}%`, backgroundColor: color },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

// ─── AmenityChip ──────────────────────────────────────────────────────────────

function AmenityChip({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <View style={styles.chip}>
      <View style={[styles.chipDot, { backgroundColor: color }]} />
      <Text style={styles.chipText}>
        {label} ×{count}
      </Text>
    </View>
  );
}

// ─── BestClusterCard ──────────────────────────────────────────────────────────

function BestClusterCard({ cluster }: { cluster: BestCluster }) {
  const similarityPct = Math.round(cluster.similarity * 100);
  const top3 = cluster.dominant_amenities.slice(0, 3);

  return (
    <View style={clusterStyles.card}>
      <View style={clusterStyles.header}>
        <View style={clusterStyles.iconBox}>
          <Text style={{ fontSize: 18 }}>🏘</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={clusterStyles.title}>Best Matching Neighborhood</Text>
          <Text style={clusterStyles.label} numberOfLines={2}>
            {cluster.label}
          </Text>
        </View>
        <View style={clusterStyles.badge}>
          <Text style={clusterStyles.badgeText}>{similarityPct}%</Text>
          <Text style={clusterStyles.badgeSub}>match</Text>
        </View>
      </View>

      <View style={clusterStyles.amenityRow}>
        {top3.map((a, i) => {
          const color = RELEVANCE_COLORS[i % RELEVANCE_COLORS.length];
          const icon = AMENITY_ICONS[a.amenity.toLowerCase()] ?? "📍";
          const weight = Math.round(a.centroid_weight * 100);
          return (
            <View
              key={a.amenity}
              style={[
                clusterStyles.amenityPill,
                { borderColor: color + "40", backgroundColor: color + "12" },
              ]}
            >
              <Text style={{ fontSize: 13 }}>{icon}</Text>
              <View>
                <Text style={[clusterStyles.amenityName, { color }]}>
                  {a.amenity.charAt(0).toUpperCase() + a.amenity.slice(1)}
                </Text>
                <Text style={clusterStyles.amenityWeight}>
                  {weight}% weight
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── FactorContributionsSection ───────────────────────────────────────────────

function FactorContributionsSection({
  amenityType,
  contributions,
}: {
  amenityType: string;
  contributions: FactorContribution[];
}) {
  const label = amenityType.charAt(0).toUpperCase() + amenityType.slice(1);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Factors considered for{" "}
          <Text style={{ color: "#9d7ff4" }}>{label}</Text>
        </Text>
      </View>
      <View style={styles.card}>
        {contributions.map((fc, i) => {
          const color = RELEVANCE_COLORS[i % RELEVANCE_COLORS.length];
          const icon = AMENITY_ICONS[fc.amenity.toLowerCase()] ?? "📍";
          const pct = Math.round(fc.normalized_contribution * 100);
          return (
            <View key={fc.amenity} style={fcStyles.row}>
              <View
                style={[fcStyles.iconBox, { backgroundColor: color + "1a" }]}
              >
                <Text style={{ fontSize: 15 }}>{icon}</Text>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={fcStyles.rowTop}>
                  <Text style={fcStyles.amenityName}>
                    {fc.amenity.charAt(0).toUpperCase() + fc.amenity.slice(1)}
                  </Text>
                  <Text style={[fcStyles.pct, { color }]}>{pct}%</Text>
                </View>
                <Text style={fcStyles.explanation}>{fc.explanation}</Text>
                <View style={fcStyles.track}>
                  <View
                    style={[
                      fcStyles.fill,
                      { width: `${pct}%`, backgroundColor: color },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── FactorLocationsMap ───────────────────────────────────────────────────────

function FactorLocationsMap({
  centerLat,
  centerLng,
  factorLocations,
}: {
  centerLat: number;
  centerLng: number;
  factorLocations: Record<string, FactorLocation[]>;
}) {
  const mapRef = useRef<MapView>(null);

  // Flatten all factor locations into a pin list
  const pins = Object.entries(factorLocations).flatMap(([amenity, locs]) =>
    locs.map((loc) => ({ amenity, ...loc })),
  );

  if (pins.length === 0) return null;

  // Stable color map: amenity key → color
  const amenityKeys = Object.keys(factorLocations);
  const amenityColorMap: Record<string, string> = {};
  amenityKeys.forEach((key, i) => {
    amenityColorMap[key] = RELEVANCE_COLORS[i % RELEVANCE_COLORS.length];
  });

  // ── Fixed 250m radius viewport ─────────────────────────────────────────────
  // 250m + 20% padding = 300m effective radius
  // 1 degree lat ≈ 111,000m  →  300m * 2 / 111000 ≈ 0.0054
  // lng delta scaled by cos(lat) to keep the view square on screen
  const RADIUS_M = 100; // 250m + padding
  const latDelta = (RADIUS_M * 2) / 111000;
  const lngDelta = latDelta / Math.cos((centerLat * Math.PI) / 180);

  const initialRegion = {
    latitude: centerLat,
    longitude: centerLng,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };

  // Only keep tracksViewChanges=true when there are few pins (perf guard)
  const trackPins = pins.length < 40;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Relevance Factor Locations</Text>
        <Text style={styles.sectionCount}>{pins.length} pins</Text>
      </View>

      {/* Legend */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chipRow}>
          {amenityKeys.map((key, i) => (
            <AmenityChip
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              count={factorLocations[key].length}
              color={RELEVANCE_COLORS[i % RELEVANCE_COLORS.length]}
            />
          ))}
        </View>
      </ScrollView>

      {/* Map */}
      <View style={mapStyles.wrapper}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={mapStyles.map}
          customMapStyle={mapTileStyleDark}
          userInterfaceStyle="dark"
          region={initialRegion}
          scrollEnabled
          zoomEnabled
          rotateEnabled={false}
          pitchEnabled={false}
          showsCompass={false}
          showsBuildings
        >
          {/* ── Factor pins (rendered first so center sits on top) ── */}
          {pins.map((pin, i) => {
            const color = amenityColorMap[pin.amenity] ?? "#9d7ff4";
            const emoji = AMENITY_ICONS[pin.amenity.toLowerCase()] ?? "📍";

            return (
              <Marker
                key={`factor-${pin.amenity}-${i}`}
                coordinate={{ latitude: pin.lat, longitude: pin.lon }}
                anchor={{ x: 0.5, y: 1 }}
                tracksViewChanges={trackPins}
              >
                <View style={pinStyles.wrapper}>
                  <View style={[pinStyles.bubble, { borderColor: color }]}>
                    <Text style={pinStyles.emoji}>{emoji}</Text>
                  </View>
                  <View style={[pinStyles.tail, { borderTopColor: color }]} />
                  <View style={[pinStyles.dot, { backgroundColor: color }]} />
                </View>
              </Marker>
            );
          })}

          {/* ── Center / evaluated location (highest zIndex) ── */}
          <Marker
            coordinate={{ latitude: centerLat, longitude: centerLng }}
            anchor={{ x: 0.5, y: 1 }}
            zIndex={999}
            tracksViewChanges={false}
          >
            <View style={mapStyles.centerWrapper}>
              <View style={mapStyles.centerBubble}>
                <Text style={mapStyles.centerEmoji}>📌</Text>
              </View>
              <View style={mapStyles.centerTail} />
              <View style={mapStyles.centerDot} />
            </View>
          </Marker>
        </MapView>

        {/* Overlay count label */}
        <View style={mapStyles.overlayLabel} pointerEvents="none">
          <Text style={mapStyles.overlayText}>
            {pins.length} nearby amenities plotted
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function EvaluateResultScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    result: string;
    amenityType: string;
    lat: string;
    lng: string;
  }>();

  const result: EvaluateResult = JSON.parse(params.result ?? "{}");
  const amenityType = params.amenityType ?? "Business";

  useEffect(() => {
    const save = async () => {
      try {
        const key = "evaluate_results_v1";
        const raw = await AsyncStorage.getItem(key);
        const stored: {
          amenityType: string;
          finalScore: number;
          lat: number;
          lng: number;
          timestamp: number;
        }[] = raw ? JSON.parse(raw) : [];

        const lat = parseFloat(params.lat ?? "0");
        const lng = parseFloat(params.lng ?? "0");

        const filtered = stored.filter(
          (s) =>
            !(
              s.amenityType === amenityType &&
              Math.abs(s.lat - lat) < 0.0005 &&
              Math.abs(s.lng - lng) < 0.0005
            ),
        );

        await AsyncStorage.setItem(
          key,
          JSON.stringify(
            [
              {
                amenityType,
                finalScore: result.finalScore,
                lat,
                lng,
                timestamp: Date.now(),
              },
              ...filtered,
            ].slice(0, 50),
          ),
        );
      } catch {}
    };
    save();
  }, []);

  const { finalScore, floodScore, environmentScore, details } = result;
  const env = details?.environment;
  const top_factors = env?.top_factors ?? [];
  const factor_locations = env?.factor_locations ?? {};
  const best_cluster = env?.best_cluster ?? null;
  const factor_contributions = env?.breakdown?.factor_contributions ?? [];
  const floodRisk = details?.flood?.flood_risk_score ?? 0;

  const centerLat = parseFloat(params.lat ?? "0");
  const centerLng = parseFloat(params.lng ?? "0");

  const allAmenities = Object.entries(factor_locations).map(([key, locs]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    count: locs.length,
  }));

  const floodSafe = floodRisk === 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Image
            source={icons["chevron-left"]}
            style={styles.backIcon}
            tintColor="#e8e6f0"
          />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {amenityType.charAt(0).toUpperCase() + amenityType.slice(1)}
          </Text>
          <Text style={styles.headerSub}>
            {centerLat.toFixed(4)}° N, {centerLng.toFixed(4)}° E
          </Text>
        </View>
        <View
          style={[
            styles.scoreBadge,
            {
              backgroundColor: finalScore >= 0.75 ? "#3ecf8e1a" : "#f5a6231a",
              borderColor: finalScore >= 0.75 ? "#3ecf8e4d" : "#f5a6234d",
            },
          ]}
        >
          <Text
            style={[
              styles.scoreBadgeText,
              { color: finalScore >= 0.75 ? "#3ecf8e" : "#f5a623" },
            ]}
          >
            {Math.round(finalScore * 100)}%
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        {/* Score Card */}
        <View style={styles.card}>
          <ScoreRing score={finalScore} amenityType={amenityType} />
          <View style={styles.subScoreRow}>
            <SubScorePill
              label="Environment"
              value={environmentScore}
              color="#9d7ff4"
              display={`${Math.round(environmentScore * 100)}%`}
            />
          </View>
        </View>

        {/* Flood Risk */}
        <View
          style={[
            styles.floodCard,
            floodSafe ? styles.floodSafe : styles.floodDanger,
          ]}
        >
          <View
            style={[
              styles.floodIcon,
              { backgroundColor: floodSafe ? "#3ecf8e1a" : "#f060601a" },
            ]}
          >
            <Text style={{ fontSize: 20 }}>{floodSafe ? "🛡" : "⚠️"}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.floodTitle,
                { color: floodSafe ? "#3ecf8e" : "#f06060" },
              ]}
            >
              {floodSafe ? "Low Flood Risk" : "Flood Risk Detected"}
            </Text>
            <Text style={styles.floodSub}>
              Risk score: {floodRisk.toFixed(2)} · Elevation checked ·{" "}
              {floodSafe ? "Safe zone confirmed" : "Proceed with caution"}
            </Text>
          </View>
        </View>

        {/* Best Cluster */}
        {best_cluster && <BestClusterCard cluster={best_cluster} />}

        {/* Factor Locations Map */}
        {Object.keys(factor_locations).length > 0 && (
          <FactorLocationsMap
            centerLat={centerLat}
            centerLng={centerLng}
            factorLocations={factor_locations}
          />
        )}

        {/* Top Factors */}
        {top_factors.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Relevance Factors</Text>
              <Text style={styles.sectionCount}>
                {top_factors.length} factors
              </Text>
            </View>
            <View style={styles.card}>
              {top_factors.map((f, i) => (
                <FactorRow key={f.amenity} factor={f} index={i} />
              ))}
            </View>
          </View>
        )}

        {/* Factor Contributions */}
        {factor_contributions.length > 0 && (
          <FactorContributionsSection
            amenityType={amenityType}
            contributions={factor_contributions}
          />
        )}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0e10" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#1a1820",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { width: 16, height: 16 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 15, fontWeight: "600", color: "#e8e6f0" },
  headerSub: { fontSize: 11, color: "#7a7890", marginTop: 1 },
  scoreBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  scoreBadgeText: { fontSize: 13, fontWeight: "700" },

  body: { padding: 20, gap: 16 },

  card: {
    backgroundColor: "#1a1820",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 16,
    gap: 14,
  },

  ringContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  ringWrapper: {
    position: "relative",
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  ringBg: { position: "absolute", borderWidth: 8 },
  ringInner: { alignItems: "center" },
  ringScore: { fontSize: 24, fontWeight: "700" },
  ringLabel: { fontSize: 10, color: "#7a7890", marginTop: 2 },
  ringInfo: { flex: 1, gap: 4 },
  ringTitle: { fontSize: 16, fontWeight: "600", color: "#e8e6f0" },
  ringBusiness: { fontSize: 12, color: "#7a7890" },

  subScoreRow: { flexDirection: "row", gap: 8 },
  pill: {
    flex: 1,
    backgroundColor: "#211f28",
    borderRadius: 10,
    padding: 10,
    gap: 3,
  },
  pillLabel: {
    fontSize: 9,
    fontWeight: "500",
    color: "#7a7890",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pillValue: { fontSize: 14, fontWeight: "700" },
  pillTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: "#2a2735",
    overflow: "hidden",
    marginTop: 4,
  },
  pillFill: { height: "100%", borderRadius: 2 },

  floodCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  floodSafe: {
    backgroundColor: "rgba(62,207,142,0.06)",
    borderColor: "rgba(62,207,142,0.2)",
  },
  floodDanger: {
    backgroundColor: "rgba(240,96,96,0.06)",
    borderColor: "rgba(240,96,96,0.2)",
  },
  floodIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  floodTitle: { fontSize: 13, fontWeight: "600" },
  floodSub: { fontSize: 11, color: "#7a7890", marginTop: 2 },

  section: { gap: 10 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 13, fontWeight: "600", color: "#e8e6f0" },
  sectionCount: { fontSize: 11, color: "#7a7890" },

  factorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  factorIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  factorInfo: { flex: 1 },
  factorName: { fontSize: 12, fontWeight: "500", color: "#e8e6f0" },
  factorCount: { fontSize: 10, color: "#7a7890", marginTop: 1 },
  factorRight: { alignItems: "flex-end", gap: 4 },
  factorPct: { fontSize: 12, fontWeight: "700" },
  factorTrack: {
    width: 60,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#2a2735",
    overflow: "hidden",
  },
  factorFill: { height: "100%", borderRadius: 2 },

  chipRow: { flexDirection: "row", gap: 8, paddingBottom: 4 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1a1820",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipDot: { width: 6, height: 6, borderRadius: 3 },
  chipText: { fontSize: 11, color: "#7a7890" },

  ctaRow: { flexDirection: "row", gap: 10, marginTop: 4 },
  ctaSecondary: {
    flex: 1,
    backgroundColor: "#1a1820",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  ctaSecondaryText: { fontSize: 13, fontWeight: "500", color: "#e8e6f0" },
  ctaPrimary: {
    flex: 1,
    backgroundColor: "#7c5af0",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  ctaPrimaryText: { fontSize: 13, fontWeight: "700", color: "#fff" },
});

// ─── Map styles ───────────────────────────────────────────────────────────────

const mapStyles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    overflow: "hidden",
    height: 300,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  overlayLabel: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(15,14,16,0.75)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  overlayText: {
    fontSize: 10,
    color: "#7a7890",
  },
  centerWrapper: { alignItems: "center" },
  centerBubble: {
    backgroundColor: "#1a1820",
    borderWidth: 2,
    borderColor: "#9d7ff4",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    shadowColor: "#9d7ff4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 8,
  },
  // ↑ Bigger, more prominent center pin
  centerEmoji: { fontSize: 18 },
  centerTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#9d7ff4",
    marginTop: -1,
  },
  centerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#9d7ff4",
    marginTop: 2,
  },
});

// ─── Pin styles ───────────────────────────────────────────────────────────────

const pinStyles = StyleSheet.create({
  wrapper: { alignItems: "center" },
  bubble: {
    backgroundColor: "#131215",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 5,
  },
  // Slightly larger emoji so it's readable at street-zoom level
  emoji: { fontSize: 15 },
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
});

// ─── Cluster / fc styles ──────────────────────────────────────────────────────

const clusterStyles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1820",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 14,
    gap: 12,
  },
  header: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#9d7ff41a",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 11,
    fontWeight: "500",
    color: "#7a7890",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  label: { fontSize: 12, color: "#c8c4d8", lineHeight: 17 },
  badge: {
    alignItems: "center",
    backgroundColor: "#9d7ff41a",
    borderWidth: 1,
    borderColor: "#9d7ff440",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: { fontSize: 15, fontWeight: "800", color: "#9d7ff4" },
  badgeSub: { fontSize: 9, color: "#9d7ff4", opacity: 0.7 },
  amenityRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  amenityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flex: 1,
    minWidth: "30%",
  },
  amenityName: { fontSize: 11, fontWeight: "600" },
  amenityWeight: { fontSize: 9, color: "#7a7890", marginTop: 1 },
});

const fcStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amenityName: { fontSize: 12, fontWeight: "600", color: "#e8e6f0" },
  pct: { fontSize: 12, fontWeight: "700" },
  explanation: { fontSize: 11, color: "#9a96aa", lineHeight: 16 },
  track: {
    height: 3,
    borderRadius: 2,
    backgroundColor: "#2a2735",
    overflow: "hidden",
    marginTop: 2,
  },
  fill: { height: "100%", borderRadius: 2 },
});
