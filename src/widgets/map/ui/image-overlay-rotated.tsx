import { useEffect } from "react";
import {
  type ImageOverlayOptions,
  imageOverlay,
  LatLngExpression,
} from "leaflet";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-imageoverlay-rotated";

export interface ImageOverlayRotatedProps {
  imgSrc: string | HTMLImageElement | HTMLCanvasElement;
  topleft: LatLngExpression;
  topright: LatLngExpression;
  bottomleft: LatLngExpression;
  options?: ImageOverlayOptions;
  interactive?: boolean;
}

export const ImageOverlayRotated = ({
  imgSrc,
  topleft,
  topright,
  bottomleft,
  interactive,
  ...props
}: ImageOverlayRotatedProps) => {
  const map = useMap();

  useEffect(() => {
    const rotateImage = imageOverlay.rotated(
      imgSrc,
      topleft,
      topright,
      bottomleft,
      { interactive: true },
    );

    rotateImage.addTo(map);

    return () => {
      map.removeLayer(rotateImage);
    };
  }, [map, imgSrc, topleft, topright, bottomleft, interactive, props]);

  return null;
};
