import { NextResponse } from "next/server";
import { api } from "@/lib/api";

export async function GET() {
  try {
    const response = await api.get("/healthz");
    const data = response.data;
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch health" },
      { status: 500 }
    );
  }
}
