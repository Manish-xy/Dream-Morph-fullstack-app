import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const DashboardLayout = async ({children} : { children: React.ReactNode }) => {

    const { userId } = await auth();

    if (!userId) redirect("/sign-in");

  return <div>{children}</div>;
};
export default DashboardLayout;
