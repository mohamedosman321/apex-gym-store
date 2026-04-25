import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import "@/models/User";
import { verifyToken } from "@/lib/auth";

function adminGuard(req: NextRequest) {
  const auth = req.headers.get("authorization")?.split(" ")[1];
  const payload = auth ? verifyToken(auth) : null;
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function GET(req: NextRequest) {
  if (!adminGuard(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectDB();
  const orders = await Order.find({}).populate("userId", "name email").sort({ createdAt: -1 });
  return NextResponse.json({ orders });
}