import { useState, useEffect } from "react";
import {
  useWindowDimensions,
  View,
  ActivityIndicator,
  Image,
} from "react-native";

type Props = {
  image: any;
  maxHeight?: number;
};

const ImageResolution = ({ image, maxHeight = 300 }: Props) => {
  const { width } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState<number | null>(null);

  useEffect(() => {
    const layoutWidth = width - 32;

    const setScaledHeight = (imgW: number, imgH: number) => {
      const ratio = imgH / imgW;
      const scaledHeight = layoutWidth * ratio;
      setImageHeight(Math.min(scaledHeight, maxHeight));
    };

    if (typeof image === "number") {
      const { width: imgW, height: imgH } = Image.resolveAssetSource(image);
      setScaledHeight(imgW, imgH);
    } else if (typeof image === "string") {
      Image.getSize(
        image,
        (imgW, imgH) => setScaledHeight(imgW, imgH),
        () => setImageHeight(maxHeight)
      );
    }
  }, [image, width, maxHeight]);

  if (imageHeight === null) {
    return (
      <View
        style={{
          width: width - 32,
          height: 200,
          borderRadius: 12,
          backgroundColor: "#1a1a1a",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="#888" />
      </View>
    );
  }

  return (
    <Image
      source={typeof image === "string" ? { uri: image } : image}
      style={{
        width: width - 48,
        height: imageHeight,
        borderRadius: 12,
      }}
      resizeMode="cover"
    />
  );
};

export default ImageResolution;
