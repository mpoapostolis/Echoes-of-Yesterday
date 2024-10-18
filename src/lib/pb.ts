import PocketBase from "pocketbase"

export const clientPb = new PocketBase("https://api.findasb.com")

export const getClientPb = () => {
  if (clientPb.authStore.isValid) return clientPb
  else {
    clientPb.authStore.loadFromCookie("pb_auth")
    return clientPb
  }
}
const pb = new PocketBase("https://api.findasb.com")
export async function getPocketBase() {
  if (pb.authStore.isValid) return pb
  else {
    await pb.admins.authWithPassword(process.env.PB_ADMIN_EMAIL ?? "", process.env.PB_ADMIN_PASSWORD ?? "")
    return pb
  }
}
