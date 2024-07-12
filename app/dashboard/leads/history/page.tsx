import db from "@/app/modules/db";
import React from "react";
import { HistoryDataTable } from "./history-table";
import { columns } from "./columns";
const History = async ({ searchParams }: { searchParams: any }) => {
  const history = await db.history.findMany({
    where: {
      lead_id: Number(searchParams.id),
      deletedAt: null,
    },
  });
  return (
    <div className="flex-1 items-start gap-4 p-4 sm:px-6  md:gap-8 ">
    <HistoryDataTable columns={columns} data={history}/>
    </div>
  );
};

export default History;
