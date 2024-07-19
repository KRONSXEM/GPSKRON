import { prisma } from "@/shared/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  //@ts-ignore
  const trackers: {
    id: number;
    deviceId: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    data: {
      id: number;
      deviceId: string | null;
      commandType: string;
      timestamp: Date;
      status: string;
      latitude: number;
      longitude: number;
      speed: number;
      course: number;
      additionalData: string;
      checksum: string;
    }[];
  }[] = await prisma.trackers.findMany();

  for (let i = 0; i < trackers.length; i++) {
    trackers[i].data = await prisma.trackersData.findMany({
      where: { deviceId: trackers[i].deviceId },
      orderBy: { timestamp: "desc" },
    });
  }

  return NextResponse.json({
    data: trackers,
  });
};

interface TrackerAddType {
  deviceId?: string;
  name?: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const body: TrackerAddType = await req.json();

    if (body.deviceId && body.name) {
      await prisma.trackers.upsert({
        where: { deviceId: body.deviceId },
        update: { name: body.name, updatedAt: new Date(Date.now()) },
        create: {
          deviceId: body.deviceId,
          name: body.name,
        },
      });

      const tracker = await prisma.trackers.findMany({
        where: { deviceId: body.deviceId },
      });

      return NextResponse.json({
        data: tracker,
        status: "ok",
      });
    }

    return NextResponse.json({ data: [], status: "error" });
  } catch (err) {
    return NextResponse.json({ data: [], status: "error", error: err });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const body: TrackerAddType = await req.json();

    if (body.deviceId && body.name) {
      await prisma.trackers.upsert({
        where: { deviceId: body.deviceId },
        update: { name: body.name, updatedAt: new Date(Date.now()) },
        create: {
          deviceId: body.deviceId,
          name: body.name,
        },
      });

      const tracker = await prisma.trackers.findMany({
        where: { deviceId: body.deviceId },
      });

      return NextResponse.json({
        data: tracker,
        status: "ok",
      });
    }

    return NextResponse.json({ data: [], status: "error" });
  } catch (err) {
    return NextResponse.json({ data: [], status: "error", error: err });
  }
};
