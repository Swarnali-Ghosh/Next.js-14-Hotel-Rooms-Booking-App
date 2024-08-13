import { Suspense } from "react";
import RoomsData from "./_common/rooms-data";
import Spinner from "@/components/spinner";
import { connectMongoDB } from "@/config/db";
import { UserType } from "@/interfaces";
import { GetCurrentUserFromMongoDB } from "@/server-actions/users";
import { UserButton, currentUser } from "@clerk/nextjs";
connectMongoDB();

export default async function Home() {

  const response: any = await GetCurrentUserFromMongoDB();
  let mongoUser: UserType | null = null;

  if (response.success) {
    mongoUser = response.data;
  }
  let mongoUserId = "";
  let clerkUserId = "";
  let name = "";
  let email = "";

  if (mongoUser) {
    mongoUserId = mongoUser._id;
    clerkUserId = mongoUser?.clerkUserId;
    name = mongoUser?.name;
    email = mongoUser?.email;
  }

  const currentUserData = await currentUser();
  // let clerkUserId = currentUserData?.id;
  // let name = currentUserData?.firstName + " " + currentUserData?.lastName;
  // let email = currentUserData?.emailAddresses[0].emailAddress;

  return (
    <Suspense fallback={<Spinner fullHeight />}
    // key={suspenseKey}
    >
      <RoomsData
      //  searchParams={searchParams}
      />
    </Suspense>
  );
}
