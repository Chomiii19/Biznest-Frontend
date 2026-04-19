import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import api from "../../configs/api";
import axios from "axios";
import icons from "../../constants/icons";

interface IBookmark {
  _id: string;
  coords: { lat: number; lng: number };
  notes?: string;
  createdAt: string;
}

export default function BookmarksScreen() {
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/v1/locations/bookmarks");
      setBookmarks(data.bookmarks);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Could not load bookmarks.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/api/v1/locations/bookmarks/${id}`);
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Could not delete bookmark.",
        );
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleNavigate = (bookmark: IBookmark) => {
    router.push({
      pathname: "/(tabs)/evaluate",
      params: { lat: bookmark.coords.lat, lng: bookmark.coords.lng },
    });
  };

  const formatCoords = (coords: { lat: number; lng: number }) =>
    `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <View className="flex-1 bg-backgroundColor">
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 pt-14 pb-4 border-b border-zinc-800">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-zinc-800 rounded-full p-2"
        >
          <Image
            source={icons.next}
            className="h-5 w-5 -scale-x-[1]"
            tintColor="#d4d4d8"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View>
          <Text className="text-zinc-300 font-rBold text-xl">Bookmarks</Text>
          <Text className="text-zinc-500 font-rRegular text-xs">
            {bookmarks.length} saved location{bookmarks.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#6856CF" size="large" />
        </View>
      ) : bookmarks.length === 0 ? (
        /* Empty state */
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <View className="bg-zinc-800 rounded-full p-6">
            <Image
              source={icons.bookmark}
              className="h-10 w-10"
              tintColor="#52525b"
              resizeMode="contain"
            />
          </View>
          <Text className="text-zinc-300 font-rBold text-lg text-center">
            No saved locations yet
          </Text>
          <Text className="text-zinc-500 font-rRegular text-sm text-center">
            Tap the bookmark icon on any location to save it here.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[#6856CF] px-6 py-3 rounded-xl mt-2"
          >
            <Text className="text-zinc-300 font-rBold text-sm">
              Explore Map
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleNavigate(item)}
              activeOpacity={0.85}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
            >
              {/* Accent bar */}
              <View className="h-1 w-full bg-[#6856CF]" />

              <View className="p-4 gap-3">
                {/* Coords row */}
                <View className="flex-row items-center gap-2">
                  <Image
                    source={icons["pin-fill2"]}
                    className="h-4 w-4"
                    tintColor="#6856CF"
                    resizeMode="contain"
                  />
                  <Text className="text-zinc-300 font-rBold text-sm flex-1">
                    {formatCoords(item.coords)}
                  </Text>
                </View>

                {/* Notes */}
                {item.notes ? (
                  <Text
                    className="text-zinc-400 font-rRegular text-sm"
                    numberOfLines={2}
                  >
                    {item.notes}
                  </Text>
                ) : (
                  <Text className="text-zinc-600 font-rRegular text-sm italic">
                    No notes added
                  </Text>
                )}

                {/* Footer */}
                <View className="flex-row items-center justify-between mt-1">
                  <Text className="text-zinc-600 font-rRegular text-xs">
                    Saved {formatDate(item.createdAt)}
                  </Text>

                  <View className="flex-row gap-2 items-center">
                    <TouchableOpacity
                      onPress={() => handleNavigate(item)}
                      className="bg-[#6856CF]/20 px-3 py-1 rounded-full"
                    >
                      <Text className="text-[#a898f0] font-rBold text-xs">
                        Go here
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      className="bg-zinc-800 p-2 rounded-full"
                    >
                      {deletingId === item._id ? (
                        <ActivityIndicator size={12} color="#848483" />
                      ) : (
                        <Image
                          source={icons.x}
                          className="h-3 w-3"
                          tintColor="#848483"
                          resizeMode="contain"
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
