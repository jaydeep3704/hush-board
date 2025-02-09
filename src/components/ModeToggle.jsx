"use client";

import * as React from "react"
import { useTheme } from "next-themes"
import { SunIcon,MoonIcon } from "lucide-react"

export default function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <div className="flex gap-3">
       <SunIcon onClick={()=>setTheme('light')} className="dark:scale-100 scale-0 w-4 h-5"/>
       <MoonIcon onClick={()=>setTheme('dark')} className="dark:scale-0 scale-100 w-4 h-5"/>
    </div>
  )
}
