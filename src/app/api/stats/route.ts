import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { calculateRank } from "@/src/lib/rankSystem";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [total, correct, recent] = await Promise.all([
    db.playRecord.count({ where: { userId } }),
    db.playRecord.count({ where: { userId, correct: true } }),
    db.playRecord.findMany({
      where: { userId },
      orderBy: { playedAt: "desc" },
      take: 30,
    }),
  ]);

  const accuracy = total > 0 ? (correct / total) * 100 : 0;
  const rank = calculateRank(total, accuracy);

  return NextResponse.json({ total, correct, accuracy, rank, recent });
}
