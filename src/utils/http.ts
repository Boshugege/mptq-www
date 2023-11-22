export const api = <T>(path: string): Promise<T> => {
  return fetch('/api' + path).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json() as Promise<T>
  })
}
