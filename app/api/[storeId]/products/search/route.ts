import { NextResponse, NextRequest } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
const API_URL = process.env.FRONTEND_STORE_URL;

export async function GET(req: NextRequest) {
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