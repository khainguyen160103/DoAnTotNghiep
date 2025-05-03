

import { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/Dashboard";
export const metadata: Metadata = {
  title:
    "DLM DIGITAL",
  description: "",
};

export default function page() {
 
  return < >
      <Dashboard />
    </>;
}