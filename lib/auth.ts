import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "gymstore_secret_key_change_in_prod";

export interface JWTPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}
