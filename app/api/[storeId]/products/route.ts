import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const {
            name,
            price,
            categoryId,
            brandId,
            colorId,
            images,
            isFeatured,
            isArchived
        } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
        }

        if (!brandId) {
            return new NextResponse("Brand ID is required", { status: 400 });
        }

        if (!colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                categoryId,
                brandId,
                colorId,
                isFeatured,
                isArchived,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCTS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const brandId = searchParams.get("brandId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                brandId,
                colorId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                brand: true,
                color: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function SEARCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q || typeof q !== 'string') {
    return NextResponse.json({ message: 'Invalid query' }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_URL}/products/search?q=${q}`);
    
    if (!response.ok) {
      throw new Error('Error fetching products');
    }

    const products = await response.json();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Unknown error' }, { status: 500 });
  }
}