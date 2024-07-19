import { cn } from "@/shared/lib/utils";
import { divIcon } from "leaflet";
import { Circle } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

interface IconMarkerProps {
  id: number;
  status?: boolean;
}

export const IconMarker = ({ id, status }: IconMarkerProps) => {
  const CustomMarker = () => (
    <div className="relative flex items-center justify-center">
      <p className="absolute font-bold text-lg text-blue-500 z-[999]">{id}</p>
      <Circle
        className={cn("fill-white", status ? "text-red-600" : "text-zinc-600")}
        size={30}
      />
    </div>
  );

  const icon = divIcon({
    html: renderToStaticMarkup(<CustomMarker />),
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  return icon;
};
