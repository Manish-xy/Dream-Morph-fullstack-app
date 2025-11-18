import { Container } from "@/components/container";
import { CustomBreadCrump } from "@/components/custom-breadcrump";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Client } from "../_components/client";
import { fetchGeneratedDesigns } from "@/actions/fetch-all-designs-by-userId-and-all";
import { Designs } from "@/components/designs";

const DashboardPage = async () => {

  const {userId} = await auth();

  if(!userId) redirect('/sign-in');

  const user = await currentUser();

  if(!user) redirect('/sign-in');

  const safeUser = {
    id: user.id,
    fullName: user.firstName + ' ' + user.lastName,
    email: user.emailAddresses[0]?.emailAddress,
    imageUrl:user.imageUrl,
  };

  //fetch all design
  const designs = await fetchGeneratedDesigns(user.id); 

  
  return <Container className="space-y-4 p-4 min-md:p-8">
    <CustomBreadCrump breadCrumpItems={[{label : "Dashboard", link :"/dashboard"}]}
    breadCrumpPage="Overview"
    />

    <Client user={safeUser} />
    <Designs designs={designs} userId={userId} />
  </Container>
}

export default DashboardPage;