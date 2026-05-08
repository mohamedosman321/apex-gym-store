import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

/* ------------------------------------------------------------------ */
// Helper: safely extract Bearer token
/* ------------------------------------------------------------------ */
function getBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  const [scheme, token] = auth.split(" ");
  return scheme === "Bearer" && token ? token : null;
}

/* ------------------------------------------------------------------ */
// Helper: validate MongoDB ObjectId
/* ------------------------------------------------------------------ */
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

/* ================================================================== */
// GET  /api/orders
/* ================================================================== */
export async function GET(req: NextRequest) {
  try {
    const token = getBearerToken(req);
    const payload = token ? verifyToken(token) : null;

    if (!payload?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const orders = await Order.find({ userId: payload.userId })
      .sort({ createdAt: -1 })
      .lean(); // faster, read-only objects

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("[GET /api/orders]", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

/* ================================================================== */
// POST  /api/orders
/* ================================================================== */
export async function POST(req: NextRequest) {
  let session: mongoose.ClientSession | null = null;

  try {
    /* 1. AUTH ------------------------------------------------------ */
    const token = getBearerToken(req);
    const payload = token ? verifyToken(token) : null;

    if (!payload?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* 2. PARSE BODY ------------------------------------------------ */
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    /* 3. VALIDATE TOP-LEVEL FIELDS --------------------------------- */
    const items = body.items;
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items array is required and cannot be empty" },
        { status: 400 }
      );
    }

    const shippingAddress = body.shippingAddress;
    if (!shippingAddress || typeof shippingAddress !== "object") {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    /* 4. START TRANSACTION ----------------------------------------- */
    await connectDB();
    session = await mongoose.startSession();
    session.startTransaction();

    const orderItems = [];
    let subtotal = 0;

    /* 5. PROCESS EACH ITEM ----------------------------------------- */
    for (const raw of items) {
      const item = raw as Record<string, unknown>;
      const productId = String(item.productId ?? "");

      // --- validate IDs & quantity ---
      if (!isValidObjectId(productId)) {
        throw new Error(`Invalid product ID: ${productId}`);
      }

      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty < 1) {
        throw new Error(`Invalid quantity for product ${productId}`);
      }

      // --- fetch product (within transaction) ---
      const product = await Product.findById(productId).session(session);
      if (!product) {
        throw new Error(`Product not found: ${productId}`);
      }

      // --- validate size if provided ---
      const requestedSize = item.size ? String(item.size) : undefined;
      if (
        requestedSize &&
        product.sizes.length > 0 &&
        !product.sizes.includes(requestedSize)
      ) {
        throw new Error(
          `Size "${requestedSize}" is not available for ${product.name}`
        );
      }

      // --- atomic stock check & decrement ---
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { session, new: true }
      );

      if (!updatedProduct) {
        throw new Error(
          `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${qty}`
        );
      }

      // --- build order item from DB data (prevents price tampering) ---
      const linePrice = product.price;
      subtotal += linePrice * qty;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: linePrice,
        size: requestedSize || product.sizes[0] || "",
        quantity: qty,
        image: product.images[0] || "",
      });
    }

    /* 6. CREATE ORDER (server-calculated fields) ------------------- */
    const [createdOrder] = await Order.create(
      [
        {
          userId: new mongoose.Types.ObjectId(payload.userId),
          items: orderItems,
          subtotal,
          total: subtotal, // add shipping/tax here later if needed
          status: "pending",
          shippingAddress,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error) {
    if (session) {
      await session.abortTransaction().catch(() => {});
    }

    console.error("[POST /api/orders]", error);

    const message =
      error instanceof Error ? error.message : "Server error";

    // Return 400 for client errors (stock, validation), 500 for real server errors
    const isClientError =
      message.includes("stock") ||
      message.includes("not found") ||
      message.includes("Invalid") ||
      message.includes("not available");

    return NextResponse.json(
      { error: message },
      { status: isClientError ? 400 : 500 }
    );
  } finally {
    if (session) {
      session.endSession();
    }
  }
}