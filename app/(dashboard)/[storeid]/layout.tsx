import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({
  children,
  params
}:{
  children:React.ReactNode,
  params:{storeId:string}
}) {
  const {userId} = auth();

  if(!userId) {
    redirect('/');
  }

  const store = await prismadb.store.findFirst({
    where: {
      id:params.storeId,
      userId
    }
  })

  if(!store){
    redirect('/')
  }

  return(
    <>
    <Navbar/>
    {children}
    </>
  )

}