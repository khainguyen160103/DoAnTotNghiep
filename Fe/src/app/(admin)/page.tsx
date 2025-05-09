import type { Metadata } from "next";
import React, { useEffect } from "react";
import { notFound } from "next/navigation";
import UserTable from "@/components/tables/UserTable";
import { useAuth } from "@/context/AuthContext";
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
