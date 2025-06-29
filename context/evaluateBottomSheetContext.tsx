import { createContext, useContext, useMemo, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { IComments } from "../@types/interfaces";

const BottomSheetContext = createContext<{
  evaluateBottomSheetRef: React.RefObject<BottomSheet | null>;
  snapPoints: string[];
  postOwner: string;
  comments: IComments[];
  openBottomSheet: () => void | undefined;
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
  const evaluateBottomSheetRef = useRef<BottomSheet | null>(null);
  const snapPoints = useMemo(() => ["30%", "50%"], []);
  const openBottomSheet = () => evaluateBottomSheetRef.current?.expand();
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
