import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

function getBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  const [scheme, token] = auth.split(" ");
  return scheme === "Bearer" && token ? token : null;
}

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

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
      .lean();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("[GET /api/orders]", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    /* 1. AUTH */
    const token = getBearerToken(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* 2. PARSE BODY */
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

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

    await connectDB();

    const orderItems = [];
    let subtotal = 0;

    /* 3. VALIDATE ALL ITEMS FIRST (no DB writes yet) */
    const productsToUpdate: Array<{
      product: mongoose.Document & { _id: mongoose.Types.ObjectId; name: string; price: number; stock: number; sizes: string[]; images: string[] };
      quantity: number;
      requestedSize?: string;
    }> = [];

    for (const raw of items) {
      const item = raw as Record<string, unknown>;
      const productId = String(item.productId ?? "");

      if (!isValidObjectId(productId)) {
        return NextResponse.json(
          { error: `Invalid product ID: ${productId}` },
          { status: 400 }
        );
      }

      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty < 1) {
        return NextResponse.json(
          { error: `Invalid quantity for product ${productId}` },
          { status: 400 }
        );
      }

      // Fetch product fresh from DB
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${productId}` },
          { status: 400 }
        );
      }

      // Check stock BEFORE any write
      if (product.stock < qty) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${qty}`,
          },
          { status: 409 }
        );
      }

      const requestedSize = item.size ? String(item.size) : undefined;
      if (
        requestedSize &&
        product.sizes.length > 0 &&
        !product.sizes.includes(requestedSize)
      ) {
        return NextResponse.json(
          { error: `Size "${requestedSize}" is not available for ${product.name}` },
          { status: 400 }
        );
      }

      productsToUpdate.push({ product, quantity: qty, requestedSize });
    }

    /* 4. ATOMIC STOCK DECREMENT (one operation per product, no session needed) */
    const stockDecrements = productsToUpdate.map(({ product, quantity }) =>
      Product.findOneAndUpdate(
        { _id: product._id, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      )
    );

    const updatedProducts = await Promise.all(stockDecrements);

    // Verify all succeeded — if any failed, another request raced us
    for (let i = 0; i < updatedProducts.length; i++) {
      if (!updatedProducts[i]) {
        const { product, quantity } = productsToUpdate[i];
        return NextResponse.json(
          {
            error: `Insufficient stock for "${product.name}". Requested: ${quantity}`,
          },
          { status: 409 }
        );
      }
    }

    /* 5. BUILD ORDER ITEMS FROM DB DATA (tamper-proof) */
    for (let i = 0; i < productsToUpdate.length; i++) {
      const { product, quantity, requestedSize } = productsToUpdate[i];
      const linePrice = product.price;
      subtotal += linePrice * quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: linePrice,
        size: requestedSize || product.sizes[0] || "",
        quantity,
        image: product.images[0] || "",
      });
    }

    /* 6. CREATE ORDER */
    const order = await Order.create({
      userId: new mongoose.Types.ObjectId(payload.userId),
      items: orderItems,
      subtotal,
      total: subtotal,
      status: "pending",
      shippingAddress,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("[POST /api/orders]", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}