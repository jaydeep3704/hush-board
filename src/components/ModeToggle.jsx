"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";

export default function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // ✅ Fix: Wait until the component has mounted before rendering
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="flex gap-3">
      {theme === "dark" ? (
        <SunIcon onClick={() => setTheme("light")} className="w-4 h-5 cursor-pointer " />
      ) : (
        <MoonIcon onClick={() => setTheme("dark")} className="w-4 h-5 cursor-pointer " />
      )}
    </div>
  );
}
