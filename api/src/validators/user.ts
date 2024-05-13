import { z } from 'zod';

export const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(3),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(3),
});