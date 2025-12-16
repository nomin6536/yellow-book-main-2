export * from './lib/contract.js';
import { z } from "zod";

// Role enum (frontend/shared type)
export const RoleSchema = z.enum(["user", "admin"]);
export type Role = z.infer<typeof RoleSchema>;

// User schema with role
export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  image: z.string().url().nullable().optional(),
  role: RoleSchema, // user | admin
  createdAt: z.string().optional(), // ISO date (if serialized)
  updatedAt: z.string().optional(),
  passwordHash: z.string().optional(),
});
export type User = z.infer<typeof UserSchema>;

// Category schema
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  // optional image if you need it
  imageUrl: z.string().optional(),
});
export type Category = z.infer<typeof CategorySchema>;

// Business schema
export const BusinessSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string().email(),
  website: z.string().url(),
  location: z.string(),
  facebookUrl: z.string().url().optional(),
  instagramUrl: z.string().url().optional(),
  timetable: z.string(),
  categoryId: z.string(),
  topRating: z.boolean().optional(),
  rating: z.number().int().optional(),
  logoUrl: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});
export type Business = z.infer<typeof BusinessSchema>;