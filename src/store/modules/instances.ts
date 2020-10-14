import { Module, ActionTree, MutationTree, GetterTree } from "vuex"
import { rootState } from "../"
import { ChatMessage, Instance } from "@/socket"
import { AUTH } from "./auth"

const MESSAGE_LIMIT = 100
const KILL_LIMIT = 100

export enum INSTANCE {
  ADD = "INSTANCE_ADD",
  DEL = "INSTANCE_DEL",
  UPDATE = "INSTANCE_UPDATE",
  ADD_CHAT = "INSTANCE_ADD_CHAT",
  ADD_KILL = "INSTANCE_ADD_KILL"
}

export type InstanceState = {
  instances: Instance[],
  messages: { id: number, messages: ChatMessage[] }[]
  selected: number
}

function defaultState(): InstanceState {
  return {
    instances: [],
    messages: [],
    selected: 0
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
  [INSTANCE.ADD_CHAT](state, { message }: { message: ChatMessage}) {
    const { instance } = message
    const messages = state.messages.find(msg => msg.id === instance)
    if (messages) {
      messages.messages.push(message)
    } else {
      state.messages.push({ id: instance, messages: [message] })
      if (state.messages.length > MESSAGE_LIMIT) state.messages.shift()
    }
  }
}

const getters: GetterTree<InstanceState, rootState> = {
}

const store: Module<InstanceState, rootState> = {
  state: defaultState(),
  actions,
  mutations,
  getters
}

export default store