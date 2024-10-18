import { getClientPb } from "@/lib/pb"
import useSWR from "swr"

export interface Game {
  id: string
  name: string
  owner: string
  description: string
  genre: string
}

export function useGames(page?: number, genre?: string, searchTerm?: string) {
  const pb = getClientPb()
  const res = useSWR(
    ["/games", page, genre, searchTerm],
    async () => await pb.collection("games").getList<Game>(page + 1, 50, {}),
  )
  return {
    ...res,
    data: res?.data?.items,
    total: res?.data?.totalItems,
    totalPages: res?.data?.totalPages,
    isLoading: !res?.data && !res?.error,
    isError: res?.error,
    page,
  }
}
