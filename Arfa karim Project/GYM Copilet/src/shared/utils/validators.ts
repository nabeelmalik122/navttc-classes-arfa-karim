import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const createClassSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  category: z.enum(['hiit', 'strength', 'boxing', 'yoga', 'pilates', 'cycling', 'recovery']),
  intensity: z.enum(['low', 'moderate', 'high', 'extreme']),
  durationMinutes: z.number().min(15).max(180),
  defaultCapacity: z.number().min(1).max(100),
  description: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateClassFormData = z.infer<typeof createClassSchema>;
