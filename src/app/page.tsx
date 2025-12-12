"use client";

import { useEffect } from "react";
import { SideBarMenu } from "@/components/sidebar-menu";
import { MobileTopBar } from "@/components/mobile-top-bar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { PostsSection } from "@/components/posts-section";

export default function Home() {
  useEffect(() => {
    document.body.style.backgroundColor = "#000";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="text-secondary">
      <MobileTopBar />
      <SideBarMenu />
      <div className="bg-primary min-h-screen mt-[70px] md:mt-0">
        <PostsSection />
      </div>
      <MobileBottomNav />
    </div>
  );
}
