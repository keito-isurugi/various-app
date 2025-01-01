import { NextResponse } from "next/server";
import apiClient from "@/libs/apiClient";

export async function GET() {
  try {
    const response = await apiClient.get("/images");
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}
