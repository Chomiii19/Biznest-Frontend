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
import icons from "../../constants/icons";

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

interface DemographicData {
  population_2020: number;
  avg_family_income_php: number;
  pop_density_per_km2: number;
  growth_rate_pct: number;
  working_age_pct: number;
  youth_pct: number;
  senior_pct: number;
  purchasing_power_b_php: number;
}

interface DemographicDetails {
  city: string;
  overall_demographic_score: number;
  rank: number;
  total_cities: number;
  market_archetype: string;
  demographics: DemographicData;
  insights: string[];
}

interface EvaluateResult {
  finalScore: number;
  floodScore: number;
  environmentScore: number;
  demographicScore: number;
  details: {
    environment: {
      amenity: string;
      factor_locations: Record<string, FactorLocation[]>;
      similarity_score: number;
      top_factors: TopFactor[];
    };
    flood: {
      flood_risk_score: number;
      lat: number;
      lon: number;
    };
    demographic: DemographicDetails | null;
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
        <Text style={styles.ringBusiness} numberOfLines={1}>
          Best for:{" "}
          <Text style={{ color: "#9d7ff4" }}>
            {amenityType.charAt(0).toUpperCase() + amenityType.slice(1)}
          </Text>
        </Text>
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

// ─── DemographicsSection ──────────────────────────────────────────────────────

function DemographicsSection({ demo }: { demo: DemographicDetails }) {
  const d = demo.demographics;

  const formatIncome = (php: number) => {
    if (php >= 1_000_000) return `₱${(php / 1_000_000).toFixed(2)}M`;
    if (php >= 1_000) return `₱${(php / 1_000).toFixed(0)}K`;
    return `₱${php}`;
  };

  const formatPop = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return `${n}`;
  };

  const archetypeColor =
    demo.market_archetype === "Premium Urban"
      ? "#9d7ff4"
      : demo.market_archetype === "Dense Urban"
        ? "#4f9ef5"
        : demo.market_archetype === "Emerging Urban"
          ? "#f5a623"
          : "#3ecf8e";

  const statItems = [
    { label: "Population", value: formatPop(d.population_2020), emoji: "👥" },
    {
      label: "Avg. Income",
      value: formatIncome(d.avg_family_income_php),
      emoji: "💰",
    },
    {
      label: "Density /km²",
      value: `${(d.pop_density_per_km2 / 1000).toFixed(1)}K`,
      emoji: "🏙",
    },
    { label: "Growth Rate", value: `+${d.growth_rate_pct}%`, emoji: "📈" },
  ];

  const ageItems = [
    { label: "Youth", pct: d.youth_pct, color: "#4f9ef5" },
    { label: "Working Age", pct: d.working_age_pct, color: "#3ecf8e" },
    { label: "Senior", pct: d.senior_pct, color: "#f5a623" },
  ];

  return (
    <View style={styles.section}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Demographics</Text>
        <View
          style={[
            demoStyles.archetypeBadge,
            {
              borderColor: archetypeColor + "55",
              backgroundColor: archetypeColor + "15",
            },
          ]}
        >
          <Text style={[demoStyles.archetypeText, { color: archetypeColor }]}>
            {demo.market_archetype}
          </Text>
        </View>
      </View>

      {/* City rank banner */}
      <View style={demoStyles.rankBanner}>
        <View style={demoStyles.rankLeft}>
          <Text style={demoStyles.rankEmoji}>🏙</Text>
          <View>
            <Text style={demoStyles.rankCity}>{demo.city}</Text>
            <Text style={demoStyles.rankSub}>NCR Demographic Rank</Text>
          </View>
        </View>
        <View style={demoStyles.rankRight}>
          <Text style={demoStyles.rankNum}>#{demo.rank}</Text>
          <Text style={demoStyles.rankOf}>of {demo.total_cities}</Text>
        </View>
      </View>

      {/* Stat grid */}
      <View style={demoStyles.statGrid}>
        {statItems.map((s) => (
          <View key={s.label} style={demoStyles.statCell}>
            <Text style={demoStyles.statEmoji}>{s.emoji}</Text>
            <Text style={demoStyles.statValue}>{s.value}</Text>
            <Text style={demoStyles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Age structure */}
      <View style={demoStyles.ageCard}>
        <Text style={demoStyles.ageTitle}>Age Structure</Text>
        <View style={demoStyles.ageBar}>
          {ageItems.map((a) => (
            <View
              key={a.label}
              style={[
                demoStyles.ageBarSegment,
                { flex: a.pct, backgroundColor: a.color },
              ]}
            />
          ))}
        </View>
        <View style={demoStyles.ageLegend}>
          {ageItems.map((a) => (
            <View key={a.label} style={demoStyles.ageLegendItem}>
              <View style={[demoStyles.ageDot, { backgroundColor: a.color }]} />
              <Text style={demoStyles.ageLegendLabel}>{a.label}</Text>
              <Text style={[demoStyles.ageLegendPct, { color: a.color }]}>
                {a.pct.toFixed(1)}%
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Insights */}
      {demo.insights?.length > 0 && (
        <View style={demoStyles.insightsBox}>
          <Text style={demoStyles.insightsTitle}>📊 Key Insights</Text>
          {demo.insights.map((insight, i) => (
            <View key={i} style={demoStyles.insightRow}>
              <View style={demoStyles.insightDot} />
              <Text style={demoStyles.insightText}>{insight}</Text>
            </View>
          ))}
        </View>
      )}
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

  const {
    finalScore,
    floodScore,
    environmentScore,
    demographicScore,
    details,
  } = result;
  const { top_factors = [], factor_locations = {} } =
    details?.environment ?? {};
  const floodRisk = details?.flood?.flood_risk_score ?? 0;

  const allAmenities = Object.entries(factor_locations).map(([key, locs]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    count: locs.length,
    color:
      RELEVANCE_COLORS[Math.floor(Math.random() * RELEVANCE_COLORS.length)],
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
            {parseFloat(params.lat ?? "0").toFixed(4)}° N,{" "}
            {parseFloat(params.lng ?? "0").toFixed(4)}° E
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
            <SubScorePill
              label="Flood Risk"
              value={floodSafe ? 1 : 1 - floodRisk}
              color="#3ecf8e"
              display={floodSafe ? "Safe" : "Risk"}
            />
            <SubScorePill
              label="Demographic"
              value={demographicScore > 0 ? demographicScore : 0.05}
              color="#f5a623"
              display={
                demographicScore > 0
                  ? `${Math.round(demographicScore * 100)}%`
                  : "N/A"
              }
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

        {/* All Amenities */}
        {allAmenities.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Amenities Detected</Text>
              <Text style={styles.sectionCount}>
                {allAmenities.length} types
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipRow}>
                {allAmenities.map((a, i) => (
                  <AmenityChip
                    key={i}
                    label={a.label}
                    count={a.count}
                    color={RELEVANCE_COLORS[i % RELEVANCE_COLORS.length]}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Demographics */}
        {details?.demographic && (
          <DemographicsSection demo={details.demographic} />
        )}

        {/* CTA */}
        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.ctaSecondary}>
            <Text style={styles.ctaSecondaryText}>Save Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaPrimary}>
            <Text style={styles.ctaPrimaryText}>Pin Landmarks</Text>
          </TouchableOpacity>
        </View>
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

const demoStyles = StyleSheet.create({
  archetypeBadge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  archetypeText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.3 },

  rankBanner: {
    backgroundColor: "#1a1820",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rankLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  rankEmoji: { fontSize: 22 },
  rankCity: { fontSize: 13, fontWeight: "600", color: "#e8e6f0" },
  rankSub: { fontSize: 10, color: "#7a7890", marginTop: 1 },
  rankRight: { alignItems: "flex-end" },
  rankNum: { fontSize: 22, fontWeight: "800", color: "#f5a623" },
  rankOf: { fontSize: 10, color: "#7a7890" },

  statGrid: {
    flexDirection: "row",
    gap: 8,
  },
  statCell: {
    flex: 1,
    backgroundColor: "#1a1820",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 10,
    alignItems: "center",
    gap: 3,
  },
  statEmoji: { fontSize: 16 },
  statValue: { fontSize: 13, fontWeight: "700", color: "#e8e6f0" },
  statLabel: { fontSize: 9, color: "#7a7890", textAlign: "center" },

  ageCard: {
    backgroundColor: "#1a1820",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 14,
    gap: 10,
  },
  ageTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#7a7890",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  ageBar: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    gap: 2,
  },
  ageBarSegment: { borderRadius: 4 },
  ageLegend: { flexDirection: "row", justifyContent: "space-between" },
  ageLegendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  ageDot: { width: 7, height: 7, borderRadius: 4 },
  ageLegendLabel: { fontSize: 10, color: "#7a7890" },
  ageLegendPct: { fontSize: 11, fontWeight: "700" },

  powerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1a1820",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 12,
  },
  powerEmoji: { fontSize: 20 },
  powerLabel: { fontSize: 10, color: "#7a7890" },
  powerValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3ecf8e",
    marginTop: 1,
  },

  insightsBox: {
    backgroundColor: "#f5a62308",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f5a62325",
    padding: 14,
    gap: 8,
  },
  insightsTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#f5a623",
    marginBottom: 2,
  },
  insightRow: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  insightDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#f5a623",
    marginTop: 5,
    flexShrink: 0,
  },
  insightText: { fontSize: 12, color: "#a09cb0", lineHeight: 18, flex: 1 },
});
