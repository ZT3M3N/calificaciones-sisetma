import { useState, useEffect } from "react"

interface UseEjemploDataReturn {
  data: any
  isLoading: boolean
  error: Error | null
}

export function useEjemploData(): UseEjemploDataReturn {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/ejemplo")
        if (!response.ok) {
          throw new Error("Error al obtener los datos")
        }
        const jsonData = await response.json()
        setData(jsonData)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, isLoading, error }
}