"use client";

import * as React from "react"
import { useTheme } from "next-themes"
import { SunIcon,MoonIcon } from "lucide-react"

export default function ModeToggle() {
  const { setTheme,theme } = useTheme()

  return (
    <div className="flex gap-3">
       {theme=="dark"?<SunIcon onClick={()=>setTheme('light')} className="w-4 h-5"/>:
       <MoonIcon onClick={()=>setTheme('dark')} className="w-4 h-5"/>}
    </div>
  )
}
