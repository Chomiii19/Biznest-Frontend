import { createContext, useContext, useMemo, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { IComments } from "../@types/interfaces";

const BottomSheetContext = createContext<{
  commentBottomSheetRef: React.RefObject<BottomSheet | null>;
  snapPoints: string[];
  postOwner: string;
  comments: IComments[];
  openBottomSheet: () => void | undefined;
  setComments: React.Dispatch<React.SetStateAction<IComments[]>>;
  setPostOwner: React.Dispatch<React.SetStateAction<string>>;
  loadComments: (comments: IComments[]) => void;
} | null>(null);

export const CommentBottomSheetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [postOwner, setPostOwner] = useState("");
  const [comments, setComments] = useState<IComments[]>([]);
  const commentBottomSheetRef = useRef<BottomSheet | null>(null);
  const snapPoints = useMemo(() => ["80%"], []);
  const openBottomSheet = () => commentBottomSheetRef.current?.expand();
  const loadComments = (comments: IComments[]) => setComments(comments);

  return (
    <BottomSheetContext.Provider
      value={{
        commentBottomSheetRef,
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

export const useCommentBottomSheet = () => {
  const ctx = useContext(BottomSheetContext);
  if (!ctx)
    throw new Error("useBottomSheet must be used within BottomSheetProvider");
  return ctx;
};
