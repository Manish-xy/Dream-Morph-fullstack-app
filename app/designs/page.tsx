import { Container } from "@/components/container";
import { CustomBreadCrump } from "@/components/custom-breadcrump";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchGeneratedDesigns } from "@/actions/fetch-all-designs-by-userId-and-all";
import { DesignsGallery } from "@/components/designs-gallery";

const DesignsPage = async () => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const user = await currentUser();

  if (!user) redirect("/sign-in");

  // Fetch all designs for this user
  const designs = await fetchGeneratedDesigns(userId);

  return (
    <Container className="space-y-6 p-4 md:p-8">
      <CustomBreadCrump
        breadCrumpItems={[
          { label: "Home", link: "/" },
          { label: "Designs", link: "/designs" },
        ]}
        breadCrumpPage="My Designs"
      />

      <DesignsGallery designs={designs} userId={userId} />
    </Container>
  );
};

export default DesignsPage;
