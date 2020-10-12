import { get, post } from "./api"



export type LoginPayload = {
  username: string
  password: string
}

export type LoginResponse = {
  token: string
}

/**
 * tries to log you into an user account
 * @param payload username and password to login with
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await post("/auth/login", payload)
  return res.json()
}



export type TokenInfo = {
  v: number
  id: number
  username: string
  iat: number
}

export type WhoamiResponse = {
  permissions: {
    instance: number|null
    root: boolean
    scopes: string[]
  }[],
  token: TokenInfo
}

/**
 * gets infos about your current jwt token
 */
export async function whoami(): Promise<WhoamiResponse> {
  const res = await get("/auth/whoami")
  const data = await res.json()
  return data
}