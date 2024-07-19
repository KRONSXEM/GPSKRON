export interface CustomControlsProps {
  trackers: {
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
  }[];
  getTrackers: () => Promise<void>;
}
