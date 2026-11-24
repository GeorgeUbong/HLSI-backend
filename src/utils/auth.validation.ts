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
    z.string(),
    z.array(z.string()),
    z.null(),
  ])
    .optional()
    .transform((images) => {
      if (!images) return [];
      if (typeof images === 'string') {
        return images.trim() ? [images.trim()] : [];
      }
      return images.filter((image) => image.trim().length > 0);
    }),
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