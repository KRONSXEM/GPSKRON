import { prisma } from "@/shared/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  const trackers = await prisma.trackers.findMany({
    where: { deviceId: id },
  });

  return NextResponse.json({
    data: trackers,
  });
};

export const DELETE = async (
  _: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  const trackers = await prisma.trackers.deleteMany({
    where: { deviceId: id },
  });

  return NextResponse.json({
    data: trackers,
  });
};
