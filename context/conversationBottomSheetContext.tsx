import { createContext, useContext, useMemo, useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";

const BottomSheetContext = createContext<{
  conversationBottomSheetRef: React.RefObject<BottomSheet | null>;
  snapPoints: string[];
  openBottomSheet: () => void | undefined;
} | null>(null);

export const ConversationBottomSheetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const conversationBottomSheetRef = useRef<BottomSheet | null>(null);
  const snapPoints = useMemo(() => ["50%"], []);
  const openBottomSheet = () => conversationBottomSheetRef.current?.expand();

  return (
    <BottomSheetContext.Provider
      value={{
        conversationBottomSheetRef,
        snapPoints,
        openBottomSheet,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useConversationBottomSheet = () => {
  const ctx = useContext(BottomSheetContext);
  if (!ctx)
    throw new Error("useBottomSheet must be used within BottomSheetProvider");
  return ctx;
};
