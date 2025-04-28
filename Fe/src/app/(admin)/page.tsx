import type { Metadata } from "next";
import React from "react";

import UserTable from "@/components/tables/UserTable";

export const metadata: Metadata = {
  title:
    "DLM DIGITAL",
  description: "",
};

export default function Ecommerce() {
  return (
    <div className=" gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
      <UserTable />
      </div>
    </div>
  );
}
