import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
    opacity={0.6}
    pressBehavior="close"
  />
);

export default renderBackdrop;
