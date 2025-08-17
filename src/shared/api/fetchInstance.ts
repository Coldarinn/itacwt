export const fetchInstance = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const url = endpoint

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData: { message: string; statusCode: number } = await response.json()
    throw new Error(errorData.message || "Something went wrong")
  }

  return response
}
