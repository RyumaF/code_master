import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { correct, chordType, guessed } = await req.json();

    await db.playRecord.create({
      data: {
        userId: session.user.id,
        correct: Boolean(correct),
        chordType: String(chordType),
        guessed: String(guessed),
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "保存に失敗しました" },
      { status: 500 }
    );
  }
}
