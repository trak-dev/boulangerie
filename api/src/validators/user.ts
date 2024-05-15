import { z } from 'zod';

export const userSchema = z.object({
    email: z.string().email(),
    name: z.string().min(3),
});

export const sendMagicLinkSchema = z.object({
    email: z.string().email(),
});

export const loginSchema = z.object({
    magicLink: z.string().min(20),
});

export const userWithPasswordSchema = userSchema.extend({
    password: z.string().min(8),
});

