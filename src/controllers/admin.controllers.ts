
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import prisma from '../lib/prisma';
import {
  loginSchema,
  createProductSchema,
  updateProductSchema,
  productIdSchema,
} from '../utils/auth.validation';
import { generateToken } from '../middlewares/app.middlewares';


//LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = loginSchema.safeParse({ body: req.body });

    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { email, password } = validation.data.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Generate JWT
    const token = generateToken(user.id);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};


//CREATE PRODUCT

export const createProduct = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = createProductSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { name, images, price, desc } = validation.data;

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        images: images ?? [],
        price,
        desc,
      },
    });

    return res.status(201).json({
      message: 'Product created successfully',
      product,
    });

  } catch (error) {
    console.error('Create product error:', error);

    return res.status(500).json({
      message: 'Failed to create product',
    });
  }
};

//UPDATE PRODUCT
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const idValidation = productIdSchema.safeParse(req.params);

    if (!idValidation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: idValidation.error.flatten().fieldErrors,
      });
    }

    const { id } = idValidation.data;

    const validation = updateProductSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    const { name, images, price, desc } = validation.data;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(images !== undefined && { images }),
        ...(price !== undefined && { price }),
        ...(desc !== undefined && { desc }),
      },
    });

    return res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });

  } catch (error) {
    console.error('Update product error:', error);

    return res.status(500).json({
      message: 'Failed to update product',
    });
  }
};



//DELETE PRODUCT
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const validation = productIdSchema.safeParse(req.params);

    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { id } = validation.data;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    // Delete product
    await prisma.product.delete({
      where: { id },
    });

    return res.status(200).json({
      message: 'Product deleted successfully',
    });

  } catch (error) {
    console.error('Delete product error:', error);

    return res.status(500).json({
      message: 'Failed to delete product',
    });
  }
};

