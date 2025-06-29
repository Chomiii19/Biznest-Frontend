import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { useEvaluateBottomSheet } from "../context/evaluateBottomSheetContext";
import renderBackdrop from "./BottomSheetBackdrop";

function EvaluateBottomSheet() {
  const { snapPoints, evaluateBottomSheetRef } = useEvaluateBottomSheet();

  return (
    <BottomSheet
      ref={evaluateBottomSheetRef}
      enablePanDownToClose
      backdropComponent={(props) => renderBackdrop(props, 0.3)}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: "#848483" }}
      backgroundStyle={{ backgroundColor: "#1B1A1B" }}
      index={-1}
      enableContentPanningGesture={false}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BottomSheetView>
          <View></View>
        </BottomSheetView>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
}

export default EvaluateBottomSheet;
