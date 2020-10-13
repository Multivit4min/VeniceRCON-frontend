import io from "socket.io-client"
import store from "../store"
import { INSTANCE } from '@/store/modules/instances'
import { AUTH } from '@/store/modules/auth'

export let socket = io(store.getters.apiEndpointUrl, { autoConnect: false })

store.watch((state, getters) => getters.loggedIn, loggedIn => {
  if (loggedIn) return connect()
  disconnect()
})

/** disconnects from the socket */
function disconnect() {
  socket.disconnect()
}

/** connects to the socket */
function connect() {
  socket.io.uri = getUrl()
  return socket.connect()
}

function getUrl() {
  return `${store.getters.apiEndpointUrl}?auth_token=${store.state.auth.token}`
}

/** reconnects to the socket */
export function reconnect() {
  disconnect()
  return connect()
}


export interface Instance {
  id: number,
  host: string,
  port: number,
  version: "BF3"|"VU",
  state: number,
  serverinfo: {
    name: string,
    slots: number,
    totalSlots: number,
    mode: string,
    map: string,
    roundsPlayed: number,
    roundsTotal: number,
    scores: number[],
    targetScore: number,
    onlineState: string,
    ranked: false,
    punkBuster: false,
    password: false,
    uptime: number,
    roundTime: number,
    address: string,
    punkBusterVersion: string,
    joinQueueEnabled: false,
    region: string,
    closestPingSite: string,
    country: string,
    matchmaking: false
  },
  players: [],
  maps: MapInfo[],
  vars: Record<string, number|string|boolean>,
  mapInfo: { index: number, next: number }
}

export interface MapInfo {
  map: string,
  mode: string,
  rounds: number,
  index: number
}

export interface InstanceAddEvent {
  state: Instance
}

socket.on("INSTANCE#ADD", (event: InstanceAddEvent) => {
  store.dispatch(INSTANCE.ADD, event.state)
})

export interface InstanceUpdateEvent {
  id: number
  changes: [string, any]
}

socket.on("INSTANCE#UPDATE", (event: InstanceUpdateEvent) => {
  store.dispatch(INSTANCE.UPDATE, { id: event.id, changes: event.changes })
})

export interface InstanceRemoveEvent {
  id: number
}

socket.on("INSTANCE#REMOVE", (event: InstanceRemoveEvent) => {
  store.dispatch(INSTANCE.DEL, { id: event.id })
})

export interface ChatMessage {
  id: number
  instance: number
  name: string
  message: string
  subset: string
}

export interface ChatMessageEvent {
  messages: ChatMessage[]
}

socket.on("INSTANCE#CHAT", (event: ChatMessageEvent) => {
  console.log("INSTANCE#CHAT", event)
  store.dispatch(INSTANCE.ADD_CHAT, { messages: event.messages })
})

socket.on("INSTANCE#KILL", (event: any) => {
  console.log("INSTANCE#KILL", event)
})

socket.on("INSTANCE#LOG", (event: any) => {
  console.log("INSTANCE#LOG", event)
})

socket.on("SELF#PERMISSION_UPDATE", () => {
  store.dispatch(AUTH.WHOAMI)
})