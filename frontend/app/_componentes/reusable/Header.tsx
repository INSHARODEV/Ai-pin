"use client";
import { Activity, ArrowUp } from "lucide-react";
import Image from "next/image";
import React from "react";
import logo from "@/public/avatar.png";

export default function Header() {
  return (
    <div className="flex justify-between items-center p-10 bg-white">
      <div className="flex items-center gap-2">
        <Activity className="w-6 h-6" />
        AIPIN
      </div>
      <div className="flex items-center gap-2  p-2 rounded-md">
        <Image src={logo} alt="logo" width={32} height={32} />
        <span>John Doe</span>
        <ArrowUp className="w-6 h-6" />
      </div>
    </div>
  );
}
