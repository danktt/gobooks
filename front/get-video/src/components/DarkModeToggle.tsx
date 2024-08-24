'use client'

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export const DarkModeToggle = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="dark-mode"
        checked={theme === 'dark'}
        onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
      <Label htmlFor="dark-mode">Dark Mode</Label>
    </div>
  )
}