"use client";

import { useLayoutEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet-rotate";
import { ImageOverlayRotated } from "./image-overlay-rotated";
import { CENTER_MAP } from "@/shared/lib/constants";
import "leaflet/dist/leaflet.css";

import "leaflet-mouse-position";
import { RotateMap } from "./rotate-map";
import { MapMarker } from "@/entities/map-marker";
import { CustomControl } from "./control";

export const Map = () => {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const tile = document.querySelector(".leaflet-control-attribution");
    if (tile) tile.remove();
  }, []);

  return (
    <>
      <MapContainer
        center={CENTER_MAP}
        zoom={20}
        rotate={true}
        touchRotate={true}
        shiftKeyRotate={true}
        rotateControl={false}
        positionControl={false}
        doubleClickZoom={false}
        bearing={70.6}>
        <TileLayer
          maxZoom={24}
          minZoom={5}
          maxNativeZoom={18}
          attribution=""
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RotateMap />
        <ImageOverlayRotated
          imgSrc="depo-schema.svg"
          topleft={L.latLng(55.708083, 37.44579)}
          topright={L.latLng(55.708752, 37.44621)}
          bottomleft={L.latLng(55.70793, 37.44655)}
        />
        <MapBody />
      </MapContainer>
    </>
  );
};

const MapBody = () => {
  const [trackers, setTrackers] = useState<
    {
      id: number;
      name: string;
      deviceId: string;
      createdAt: Date;
      updatedAt: Date;
      data: {
        id: number;
        deviceId: string;
        commandType: string;
        timestamp: Date;
        status: "A" | "V";
        latitude: number;
        longitude: number;
        speed: number;
        course: number;
        checksum: string;
        additionalData: string;
      }[];
    }[]
  >([]);

  const getTrackers = async () => {
    const data = await fetch("/api/trackers");

    const trackers = await data.json();

    setTrackers(trackers.data);
  };

  useLayoutEffect(() => {
    getTrackers();

    const intr = setInterval(() => {
      getTrackers();
    }, 10000);

    return () => {
      clearInterval(intr);
    };
  }, []);

  return (
    <>
      <CustomControl trackers={trackers} getTrackers={getTrackers} />
      {trackers.map((tracker, index) => {
        return (
          <MapMarker
            key={tracker.deviceId}
            id={++index}
            position={[
              tracker.data?.[0]?.latitude || 0,
              tracker.data?.[0]?.longitude || 0,
            ]}
            name={tracker.name}
            status={tracker.data?.[0]?.additionalData[5] === "D"}
            deviceId={tracker.deviceId}
            updatedAt={tracker.updatedAt}
          />
        );
      })}
    </>
  );
};

export default Map;
