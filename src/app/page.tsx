import { connectMongoDB } from "@/config/db";
import { UserButton, currentUser } from "@clerk/nextjs";
connectMongoDB();

export default async function Home() {

  const currentUserData = await currentUser();
  let clerkUserId = currentUserData?.id;
  let name = currentUserData?.firstName + " " + currentUserData?.lastName;
  let email = currentUserData?.emailAddresses[0].emailAddress;

  return (
    <div className="flex items-center justify-center h-screen">
      {/* <h1>Clerk User Id: {clerkUserId}</h1>
      <h2>Name: {name}</h2>
      <h2>Email: {email}</h2> */}
      <UserButton afterSignOutUrl="/sign-in" />
    </div>
  );
}
