import LoginForm from "@/components/login/login-form";
import Image from "next/image";
import Login from "./login/page";
import Dashboard from "./dashboard/page";
import { SpeedInsights } from "@vercel/speed-insights/next";
export default function Home() {
  return (
    <>
      <Dashboard />
      <SpeedInsights />
    </>
  );
}
