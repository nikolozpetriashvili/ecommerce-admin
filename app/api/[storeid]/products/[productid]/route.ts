import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { productid: string } }
) {
  try {
    if (!params.productid) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productid
      },
      include:{
        images: true,
        category: true,
        size:true,
        color:true
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { productid: string, storeid: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productid) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeid,
        userId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productid,
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
  req: Request,
  { params }: { params: { productid: string, storeid: string } }
) {
  try {   
    const { userId } = auth();

    const body = await req.json();
    
    const {name,price,categoryId,colorId,sizeId,images,isFeatured,isArchived} = body;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if(!images || images.length <= 0) {
      return new NextResponse('images are required', {status:400})
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
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

    if (!params.productid) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeid,
        userId,
      }
    })

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    await prismadb.product.update({
      where: {
        id: params.productid,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images:{
          deleteMany:{}
        },
        isFeatured,
        isArchived,
      }
    });

    const product = await prismadb.product.update({
      where:{
        id:params.productid
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: {url:string})=> image)
            ]
          }
        }
      }
    })
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};