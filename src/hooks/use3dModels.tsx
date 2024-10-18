import useSWR from "swr";
import { getClientPb } from "../lib/pb";

export interface Model3d {
  id: string;
  name: string;
  creator: string;
  licence: string;
  animated: boolean;
  attribution: string;
  tags: string;
  category: string;
  obj: string;
  glb: string;
  thumbnail: string;
  attribution_owner: string;
  attribution_url: string;
}

export function use3dModels(
  page: number,
  category: string,
  searchTerm?: string,
) {
  const pb = getClientPb();
  const res = useSWR(
    ["/assets", page, category, searchTerm],
    async () =>
      await pb.collection("3d_models").getList<Model3d>(page + 1, 50, {
        filter: `category="${category}"${searchTerm ? `&& name~"${searchTerm}"` : ""}`,
      }),
  );
  return {
    data: res?.data?.items?.map((obj) => ({
      ...obj,
      thumbnail: pb?.files?.getUrl(obj, obj.thumbnail),
      glb: pb?.files?.getUrl(obj, obj.glb),
    })),
    total: res?.data?.totalItems,
    totalPages: res?.data?.totalPages,
    isLoading: !res?.data && !res?.error,
    isError: res?.error,
    page,
    category,
  };
}
