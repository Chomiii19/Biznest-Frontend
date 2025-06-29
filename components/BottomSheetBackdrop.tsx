import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

const renderBackdrop = (props: any, opacity: number) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
    opacity={opacity}
    pressBehavior="close"
  />
);

export default renderBackdrop;
