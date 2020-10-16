import { Module, ActionTree, MutationTree, GetterTree } from "vuex"
import { rootState } from "../"
import { ChatMessage, ConsoleEvent } from "../../socket"
import { Instance } from "../../../types/Instance"
import { AUTH } from "./auth"

const MESSAGE_LIMIT = 100
const KILL_LIMIT = 100
const CONSOLE_LIMIT = 200

export enum INSTANCE {
  ADD = "INSTANCE_ADD",
  DEL = "INSTANCE_DEL",
  UPDATE = "INSTANCE_UPDATE",
  ADD_CHAT = "INSTANCE_ADD_CHAT",
  ADD_KILL = "INSTANCE_ADD_KILL",
  ADD_CONSOLE = "INSTANCE_ADD_CONSOLE"
}

export type InstanceState = {
  instances: Instance[],
  messages: { id: number, messages: ChatMessage[] }[]
  console: { id: number, messages: Pick<ConsoleEvent, "type"|"words">[] }[]
}

function defaultState(): InstanceState {
  return {
    instances: [],
    messages: [],
    console: []
  }
}


const actions: ActionTree<InstanceState, rootState> = {
  [INSTANCE.ADD]({ commit }, instance) {
    commit(INSTANCE.ADD, instance)
  },
  [INSTANCE.DEL]({ commit }, props) {
    commit(INSTANCE.DEL, props)
  },
  [INSTANCE.UPDATE]({ commit }, { changes, id }) {
    changes.forEach((change: any) => commit(INSTANCE.UPDATE, { id, change })) 
  },
  [INSTANCE.ADD_CHAT]({ commit }, { messages }: { messages: ChatMessage[] }) {
    messages.forEach(message => commit(INSTANCE.ADD_CHAT, { message }))
  },
  [INSTANCE.ADD_CONSOLE]({ commit }, event: ConsoleEvent) {
    commit(INSTANCE.ADD_CONSOLE, event)
  }
}

const mutations: MutationTree<InstanceState> = {
  [AUTH.LOGOUT](state) {
    Object.assign(state, defaultState())
  },
  [INSTANCE.ADD](state, instance) {
    if (state.instances.some(({ id }) => id === instance.id)) return
    state.instances.push(instance)
  },
  [INSTANCE.DEL](state, { id }) {
    state.instances = state.instances.filter(instance => instance.id === id)
  },
  [INSTANCE.UPDATE](state, { id, change }) {
    const instance = state.instances.find(instance => instance.id === id)
    if (!instance) return
    let obj: any = instance
    const path = change[0].split(".")
    path.forEach((key: string, index: number) => {
      if (index === path.length - 1) {
        if (change[1] === null) {
          delete obj[key]
        } else {
          obj[key] = change[1]
        }
      } else {
        if (typeof obj[key] !== "object") Object.assign(obj, { [key]: {} })
        obj = obj[key]
      }
    })
  },
  [INSTANCE.ADD_CHAT](state, { message }: { message: ChatMessage }) {
    const { instance } = message
    const messages = state.messages.find(msg => msg.id === instance)
    if (messages) {
      messages.messages = [message, ...messages.messages].slice(0, MESSAGE_LIMIT)
    } else {
      state.messages.unshift({ id: instance, messages: [message] })
    }
  },
  [INSTANCE.ADD_CONSOLE](state, event: ConsoleEvent) {
    const msgs = state.console.find(c => c.id === event.id)
    const { type, words } = event
    if (msgs) {
      msgs.messages = [{ type, words }, ...msgs.messages].slice(0, CONSOLE_LIMIT)
    } else {
      state.console.unshift({ id: event.id, messages: [{ type, words }] })
    }
  }
}

const getters: GetterTree<InstanceState, rootState> = {
  getInstance(state) {
    return (id: number) => {
      const instance = state.instances.find(instance => instance.id === id)
      if (!instance) throw new Error(`could not find instance with id ${id}!`)
      return instance
    }
  },
  getInstanceState(state, getters) {
    return (id: number) => {
      const instance = getters.getInstance(id)
      switch (instance.state) {
        default:
        case 0: return "Unknown"
        case 1: return "Connecting"
        case 2: return "Connected"
        case 3: return "Disconnecting"
        case 4: return "Disconnected"
        case 5: return "Reconnecting"
      }
    }
  }

}

const store: Module<InstanceState, rootState> = {
  state: defaultState(),
  actions,
  mutations,
  getters
}

export default store