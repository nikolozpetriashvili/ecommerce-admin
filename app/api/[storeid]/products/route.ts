import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req:Request,
  {params}:{
    params:{
      storeid:string
    }
  }
) {
  try {
    const {userId} = auth();
    const body = await req.json();
    const {name,price,categoryId,colorId,sizeId,images,isFeatured,isArchived} = body;

    if(!userId){
      return new NextResponse('Unauthenticated',{status:401});
    }

    if(!name) {
      return new NextResponse('name is required', {status:400});
    }

    if(!images || images.length <= 0) {
      return new NextResponse('images are required', {status:400})
    }

    if(!price) {
      return new NextResponse('Price is required', {status:400});
    }

    if(!categoryId) {
      return new NextResponse('category id is required', {status:400});
    }

    if(!sizeId) {
      return new NextResponse('size id is required', {status:400});
    }

    if(!colorId) {
      return new NextResponse('color id is required', {status:400});
    }

    if(!params.storeid){
      return new NextResponse("Store id is required", {status:400})
    }

    const storeByUserId = await prismadb.store.findFirst({
      where:{
        id:params.storeid,
        userId
      }
    })

    if(!storeByUserId) {
      return new NextResponse("Unauthorized",{status:403})
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeid,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_POST]',error);
    return new NextResponse('Interal error',{status:500})
  }
}


export async function GET(
  req:Request,
  {params}:{
    params:{
      storeid:string
    }
  }
) { 
  try {
    const {searchParams} = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured");



    if(!params.storeid){
      return new NextResponse("Store id is required", {status:400})
    }

    const products = await prismadb.product.findMany({
      where:{
        storeId: params.storeid,
        categoryId,
        colorId,
        sizeId,
        isFeatured:isFeatured ? true : undefined,
        isArchived:false
      },
      include:{
        images:true,
        category:true,
        color:true,
        size:true,
      },
      orderBy:{
        createdAt:'desc'
      }
    })

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCT_GET]',error);
    return new NextResponse('Interal error',{status:500})
  }
}