import io from "socket.io-client"
import store from "../store"
import { INSTANCE } from "../store/modules/instances"
import { AUTH } from "../store/modules/auth"
import { Instance } from "../../types/Instance"

export const socket = io(store.getters.apiEndpointUrl, {
  autoConnect: false,
  transports: ["websocket"]
})

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
  store.dispatch(INSTANCE.ADD_CHAT, { messages: event.messages })
})

socket.on("INSTANCE#KILL", (event: any) => {
  console.log("INSTANCE#KILL", event)
})

socket.on("INSTANCE#LOG", (event: any) => {
  console.log("INSTANCE#LOG", event)
})

export interface ConsoleEvent {
  id: number
  type: "send"|"receive",
  words: string[]
}

socket.on("INSTANCE#CONSOLE", (event: ConsoleEvent) => {
  store.dispatch(INSTANCE.ADD_CONSOLE, event)
})

socket.on("SELF#PERMISSION_UPDATE", () => {
  store.dispatch(AUTH.WHOAMI)
})