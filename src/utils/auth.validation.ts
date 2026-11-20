import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Invalid email format'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long'),
  }),
});

// Optional: Export inferred TypeScript type for use in controllers
export type LoginInput = z.infer<typeof loginSchema>['body'];

//const emailSchema = z.string().email("Please enter a valid email address");

const productFieldsSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  images: z.union([
    z.string().min(1, 'Product image is required'),
    z.array(z.string().min(1, 'Product image is required')).min(1, 'At least one product image is required'),
  ])
    .transform((images) => typeof images === 'string' ? [images] : images)
    .default([]),
  price: z.coerce.number().positive('Price must be greater than zero'),
  desc: z.string().nullable().optional(),
});

export const createProductSchema = productFieldsSchema;
export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = productFieldsSchema.partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Provide at least one field to update' }
  );

export const productIdSchema = z.object({
  id: z.string().uuid('Invalid product ID'),
});