import { NextResponse } from "next/server";

import { createOrder } from "@/lib/store-data";
import type { CheckoutOrderItem } from "@/lib/types";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      customerName?: string;
      email?: string;
      address?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      items?: CheckoutOrderItem[];
    };

    const requiredText = [body.customerName, body.email, body.address, body.city, body.state, body.postalCode];
    if (requiredText.some((value) => typeof value !== "string" || value.trim().length < 2)) {
      return NextResponse.json({ error: "Please complete every checkout field." }, { status: 400 });
    }

    if (!isValidEmail(body.email ?? "")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const items = body.items.map((item) => ({
      productId: Number(item.productId),
      quantity: Math.max(1, Math.min(20, Number(item.quantity))),
      variant: typeof item.variant === "string" ? item.variant : undefined,
    }));

    if (items.some((item) => !Number.isInteger(item.productId) || item.productId <= 0 || !Number.isFinite(item.quantity))) {
      return NextResponse.json({ error: "One of your cart items is invalid." }, { status: 400 });
    }

    const order = await createOrder({
      customerName: body.customerName!.trim(),
      email: body.email!.trim(),
      address: body.address!.trim(),
      city: body.city!.trim(),
      state: body.state!.trim(),
      postalCode: body.postalCode!.trim(),
      items,
    });

    return NextResponse.json({ orderId: order.id, totalCents: order.totalCents, status: order.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create your order.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
