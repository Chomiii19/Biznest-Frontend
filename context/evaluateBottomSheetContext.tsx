import { createContext, useContext, useMemo, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { IComments } from "../@types/interfaces";

interface ICoords {
  lat: number;
  lng: number;
}

const BottomSheetContext = createContext<{
  evaluateBottomSheetRef: React.RefObject<BottomSheet | null>;
  snapPoints: string[];
  postOwner: string;
  comments: IComments[];
  coords: ICoords | null;
  openBottomSheet: (coords: ICoords) => void;
  setComments: React.Dispatch<React.SetStateAction<IComments[]>>;
  setPostOwner: React.Dispatch<React.SetStateAction<string>>;
  loadComments: (comments: IComments[]) => void;
} | null>(null);

export const EvaluateBottomSheetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [postOwner, setPostOwner] = useState("");
  const [comments, setComments] = useState<IComments[]>([]);
  const [coords, setCoords] = useState<ICoords | null>(null);
  const evaluateBottomSheetRef = useRef<BottomSheet | null>(null);

  // Three snap points:
  // 12%  → collapsed handle only (peek)
  // 55%  → shows stats + business grid + evaluate CTA
  // 92%  → full scroll including recents + listings
  const snapPoints = useMemo(() => ["12%", "55%", "92%"], []);

  const openBottomSheet = (coords: ICoords) => {
    setCoords(coords);
    // Open to mid snap by default (index 1 = 55%)
    evaluateBottomSheetRef.current?.snapToIndex(1);
  };

  const loadComments = (comments: IComments[]) => setComments(comments);

  return (
    <BottomSheetContext.Provider
      value={{
        evaluateBottomSheetRef,
        snapPoints,
        openBottomSheet,
        comments,
        setComments,
        loadComments,
        postOwner,
        setPostOwner,
        coords,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useEvaluateBottomSheet = () => {
  const ctx = useContext(BottomSheetContext);
  if (!ctx)
    throw new Error("useBottomSheet must be used within BottomSheetProvider");
  return ctx;
};
