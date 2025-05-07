
import { Metadata } from "next";
import React from "react";
import { Payroll } from "@/components/payroll";
export const metadata: Metadata = {
  title:
    "DLM DIGITAL",
  description: "",
};
export default function page() {
  return (
    <Payroll />
  );
}
