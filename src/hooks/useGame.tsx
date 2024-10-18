import { useEditor } from "@/components/editor/provider"
import { GameConfigStore, useGameConfigStore } from "@/lib/game-store"
import { getClientPb } from "@/lib/pb"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useSWR from "swr"

export interface Game {
  id: string
  gameConf: GameConfigStore
  name: string
  owner: string
  genre: string
  description: string
}

export function useGame() {
  const store = useGameConfigStore()
  const pb = getClientPb()
  const params = useParams()
  const res = useSWR(
    params.id && ["/games", params.id],
    async () => await pb.collection("games").getOne<Game>(params.id),
  )
  const { setSelectedScene } = useEditor()
  useEffect(() => {
    store.initialize(res?.data?.gameConf)
    setSelectedScene(res?.data?.gameConf?.scenes?.at(0)?.uuid)
  }, [res?.data, setSelectedScene])
  return {
    data: res?.data,
    isLoading: !res?.data && !res?.error,
    isError: res?.error,
  }
}
