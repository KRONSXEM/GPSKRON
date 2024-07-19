import { prisma } from "@/shared/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  const trackersData = await prisma.trackersData.findMany({
    where: { deviceId: id },
    orderBy: [{ timestamp: "desc" }],
  });

  return NextResponse.json({
    data: trackersData,
  });
};
