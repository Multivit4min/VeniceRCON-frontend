import { Manager, Socket } from "socket.io-client"
import store from "../store"
import { INSTANCE } from "../store/modules/instances"
import { AUTH } from "../store/modules/auth"
import { Instance } from "../../types/Instance"
import { useToast } from "primevue/usetoast"

export const manager = new Manager(store.getters.apiEndpointUrl, {
  autoConnect: false,
  transports: ["websocket"]
})

export let socket: Socket = manager.socket("/", {
  auth: { auth_token: store.state.auth.token }
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
  socket = manager.socket("/", {
    auth: { auth_token: store.state.auth.token },
  })
  return registerEvents(socket.connect())
}

/** reconnects to the socket */
export function reconnect() {
  disconnect()
  return connect()
}

function registerEvents(socket: Socket) {
 
  socket.on("INSTANCE#ADD", (event: InstanceAddEvent) => {
    store.dispatch(INSTANCE.ADD, event.state)
  })

  socket.on("INSTANCE#UPDATE", (event: InstanceUpdateEvent) => {
    store.dispatch(INSTANCE.UPDATE, { id: event.id, changes: event.changes })
  })

  socket.on("INSTANCE#REMOVE", (event: InstanceRemoveEvent) => {
    store.dispatch(INSTANCE.DEL, { id: event.id })
  })
  
  socket.on("INSTANCE#CHAT", (event: ChatMessageEvent) => {
    store.dispatch(INSTANCE.ADD_CHAT, { messages: event.messages })
  })
  
  socket.on("INSTANCE#KILL", (event: any) => {
    console.log("INSTANCE#KILL", event)
  })
  
  socket.on("INSTANCE#LOG", (event: InstanceLogEvent) => {
    const toast = useToast()
    event.messages.forEach(({ level, instanceId, message }) => {
      toast.add({
        severity: level,
        detail: message,
        summary: `from ${instanceId}`,
        life: 4000
      })
    })
    console.log("INSTANCE#LOG", event)
  })
  
  socket.on("INSTANCE#CONSOLE", (event: ConsoleEvent) => {
    store.dispatch(INSTANCE.ADD_CONSOLE, event)
  })
  
  socket.on("SELF#PERMISSION_UPDATE", () => {
    store.dispatch(AUTH.WHOAMI)
  })

  return socket
}



export interface InstanceAddEvent {
  state: Instance
}
  
export interface InstanceUpdateEvent {
  id: number
  changes: [string, any]
}

export interface InstanceRemoveEvent {
  id: number
}

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

export interface InstanceLogEvent {
  messages: {
    created: string
    instanceId: number
    level: string
    message: string
    source: number
    sourceLocation: string|null
  }[]
}

export interface ConsoleEvent {
  id: number
  type: "send"|"receive",
  words: string[]
}