import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const searchQuery = searchParams.get("q") || undefined;  // Ensure searchQuery is either a string or undefined

        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                name: searchQuery ? {
                    contains: searchQuery,
                    mode: 'insensitive', // Optional: makes the search case-insensitive
                } : undefined,
                isArchived: false,
            },
            include: {
                images: true,
                category: true,
                brand: true,
                color: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.log('[PRODUCTS_SEARCH_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
