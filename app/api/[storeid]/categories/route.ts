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
    const {name,billboardid} = body;

    if(!userId){
      return new NextResponse('Unauthenticated',{status:401});
    }

    if(!name) {
      return new NextResponse('Name is required', {status:400});
    }

    if(!billboardid) {
      return new NextResponse('billboard is required', {status:400});
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

    const category = await prismadb.category.create({
      data:{
        name,
        billboardId:billboardid,
        storeId: params.storeid
      }
    })

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORIES_POST]',error);
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
    if(!params.storeid){
      return new NextResponse("Store id is required", {status:400})
    }

    const categories = await prismadb.category.findMany({
      where:{
        storeId: params.storeid
      }
    })

    return NextResponse.json(categories);
  } catch (error) {
    console.log('[CATEGORIES_GET]',error);
    return new NextResponse('Interal error',{status:500})
  }
}