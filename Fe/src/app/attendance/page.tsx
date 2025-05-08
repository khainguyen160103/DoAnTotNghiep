import { Metadata } from "next";
import React from "react";
import { Attendance } from "@/components/attendance";

export const metadata: Metadata = {
  title:
    "DLM DIGITAL",
  description: "",
};

export default function Page() {
  return <Attendance />;
}
