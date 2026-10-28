import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET || "dev_super_secret_jwt_key_123";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev_super_secret_refresh_key_456";

export interface JwtUserPayload {
  id: number;
  email: string;
  role: "admin" | "user";
  name: string;
  status: "approved" | "pending" | "rejected";
}

export function generateAccessToken(payload: JwtUserPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(payload: JwtUserPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): JwtUserPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JwtUserPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): JwtUserPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET) as JwtUserPayload;
  } catch {
    return null;
  }
}
