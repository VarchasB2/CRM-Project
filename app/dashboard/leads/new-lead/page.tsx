import db from "@/app/modules/db";
import CreateLeadForm from "@/components/tables/Leads/forms/create-lead";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const NewLead = async () => {
  const session = await getServerSession(authOptions);
  const users = await db.user.findMany({
    where: {
      role: "user",
    },
    select: {
      name: true,
    },
  });
  const userNames = users.map((user) => ({
    label: user.name,
    value: user.name
  }));
  // console.log('USER NAMES IN PAGE',userNames)
  return (
    <div className="testxl:grid flex-1 items-center gap-4 p-4 sm:py-20 md:gap-8  justify-center ">
      <CreateLeadForm users={userNames} currentUser={session?.user.username!} />
    </div>
  );
};

export default NewLead;
