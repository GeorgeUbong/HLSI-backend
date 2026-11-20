
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (products.length === 0) {
      return res.status(200).json({
        message: 'No products available',
        products: [],
      });
    }

    return res.status(200).json({
      message: 'Products retrieved successfully',
      count: products.length,
      products,
    });

  } catch (error) {
    console.error('Get products error:', error);

    return res.status(500).json({
      message: 'Failed to retrieve products',
    });
  }
};
