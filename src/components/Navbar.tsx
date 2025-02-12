"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import ModeToggle from "@/components/ModeToggle";
import Link from "next/link";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session, status } = useSession();
  const user: User | null = session?.user as User;
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  return (
    <nav className="flex w-full h-[80px] items-center  justify-between px-[8%] border-b-[0.5px] dark:border-neutral-800 bg-background  dark:bg-saas-background bg-[#101524] text-white">
      <h2 className="text-xl  font-semibold dark:text-neon-green">HushBoard.</h2>

      {/* ✅ Fix: Don't render session UI until it's loaded */}
      {status === "loading" ? null : session ? (
        <div className="md:block hidden">
          Welcome, <span className="text-md font-semibold dark:text-neon-green">
            {user?.username || user?.email}
          </span>
        </div>
      ) : null}

      <div className="flex gap-5 items-center">
        {status === "loading" ? null : status !== "authenticated" ? (
          <Link href={"/sign-in"}>Login</Link>
        ) : (
          <Button onClick={handleLogout} className="shadow-none text-md  dark:bg-neon-green bg-white text-black dark:text-white" >
            Logout
          </Button>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
