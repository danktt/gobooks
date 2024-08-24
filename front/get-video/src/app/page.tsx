'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useVideoActions } from "@/hooks/useVideoActions"
import { LoaderIcon } from "lucide-react"
import { FormEvent, useEffect, useState } from "react"

export default function Home() {
  const [url, setUrl] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const { downloadVideo } = useVideoActions()

  useEffect(() => {
    const savedHistory = localStorage.getItem('urlHistory')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const addToHistory = (newUrl: string) => {
    const updatedHistory = [newUrl, ...history.filter(item => item !== newUrl)].slice(0, 5)
    setHistory(updatedHistory)
    localStorage.setItem('urlHistory', JSON.stringify(updatedHistory))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsDownloading(true)
    setError(null)
    try {
      addToHistory(url)
      const blob = await downloadVideo(url)
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = 'video.mp4'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white dark:bg-gray-900">
      
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">YouDownloader</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <Input
          type="url"
          placeholder="Enter video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          list="url-history"
        />
        <datalist id="url-history">
          {history.map((item, index) => (
            <option key={index} value={item} />
          ))}
        </datalist>
        <Button type="submit" className="w-full" disabled={isDownloading}>
          {isDownloading ? (
              <LoaderIcon className=" h-4 w-4 animate-spin" />
          ) : 'Download'}
        </Button>
      </form>
      {error && (
        <p className="text-red-500 mt-4">
          {error}
        </p>
      )}
    </main>
  )
}