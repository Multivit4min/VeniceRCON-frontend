import { Manager, Socket } from "socket.io-client"
import store from "../store"
import { INSTANCE } from "../store/modules/instances"
import { Instance } from "../../types/Instance"
//@ts-expect-error 
import { useToast } from "primevue/usetoast"
import { defineComponent } from 'vue'
import api from '../api'

const DEFAULT_OPTIONS = {
  autoConnect: false,
  transports: ["websocket"]
}

export default defineComponent({
  name: "SocketManager",
  render: () => "",
  data() {
    return {
      manager: new Manager(store.getters.apiEndpointUrl, DEFAULT_OPTIONS),
      toast: useToast(),
      unwatch: undefined as undefined|(() => void)
    }
  },
  mounted() {
    this.unwatch = store.watch((state, getters) => getters.loggedIn, loggedIn => {
      if (loggedIn) return this.connect()
      this.disconnect()
    })
    if (store.getters.loggedIn) this.connect()
  },
  unmounted() {
    if (this.unwatch) this.unwatch()
  },
  methods: {
    connect() {
      this.manager = new Manager(store.getters.apiEndpointUrl, DEFAULT_OPTIONS)
      const auth_token = store.state.auth.token
      socket = this.manager.socket("/", { auth: { auth_token }})
      this.registerEvents(socket)
      socket.connect()
    },
    disconnect() {
      socket.disconnect()
    },
    reconnect() {
      this.disconnect()
      return this.connect()
    },
    registerEvents(socket: Socket) {
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
      socket.on("INSTANCE#KILL", (event: KillEvent) => {
        console.log("INSTANCE#KILL", event.kills)
      })      
      socket.on("INSTANCE#LOG", (event: InstanceLogEvent) => {
        console.log("INSTANCE#LOG", event)
        event.messages.forEach(({ level, instanceId, message }) => {
          this.toast.add({
            severity: level,
            detail: message,
            summary: `from ${instanceId}`,
            life: 4000
          })
        })
      })
      socket.on("INSTANCE#CONSOLE", (event: ConsoleEvent) => {
        store.dispatch(INSTANCE.ADD_CONSOLE, event)
      })
      socket.on("SELF#PERMISSION_UPDATE", () => api.whoami())
      return socket
    }
  }
})

export let socket: Socket



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

export interface KillEvent {
  kills: {
    created: string
    headshot: boolean
    id: number
    instance: number
    killed: { guid: string, name: string },
    killer?: { guid: string, name: string },
    weapon: string
  }[]
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