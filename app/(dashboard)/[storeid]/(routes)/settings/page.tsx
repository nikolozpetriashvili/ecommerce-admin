import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/Settings-form";

interface SettingsPageProps{
  params:{
    storeid:string;
  }
}

const SettingsPage:React.FC<SettingsPageProps> = async ({
  params
}) => {
  const {userId} = auth();
  console.log(params);

  if(!userId) {
    redirect('/')
  }

  const store = await prismadb.store.findFirst({
    where:{
      id:params.storeid,
      userId,
    },
  })

  if(!store){
    redirect('/');
  }

  return(
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6" >
        <SettingsForm initialData={store} />
      </div>
    </div>
  )
}

export default SettingsPage;