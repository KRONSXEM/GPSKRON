import { CENTER_MAP } from "@/shared/lib/constants";
import React from "react";
import { Marker, Popup } from "react-leaflet";
import { IconMarker } from "./icon-marker";
import { type LatLngExpression } from "leaflet";
import { cn, getCurrentTime } from "@/shared/lib/utils";

interface MapMarkerProps {
  id: number;
  name?: string;
  deviceId?: string;
  status?: boolean;
  updatedAt?: Date;
  position: LatLngExpression;
}

export const MapMarker = ({
  id,
  name,
  deviceId,
  status,
  updatedAt,
  position,
}: MapMarkerProps) => {
  return (
    <Marker position={position} icon={IconMarker({ id })}>
      <Popup>
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-lg mb-2">{name}</h2>
          <p className="!m-0">ID: {deviceId}</p>
          <div className="flex gap-1">
            <p className="!m-0">Состояние:</p>
            <p
              className={cn(
                "!m-0 font-semibold",
                status ? "text-green-600" : "text-red-600",
              )}>
              {status ? "Включен" : "Выключен"}
            </p>
          </div>
          <p className="!m-0">
            Последнее обновление:{" "}
            {updatedAt
              ? getCurrentTime({ timestamp: updatedAt })
              : getCurrentTime()}
          </p>
        </div>
      </Popup>
    </Marker>
  );
};
