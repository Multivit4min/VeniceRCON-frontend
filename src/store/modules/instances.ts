import { Module, ActionTree, MutationTree, GetterTree } from "vuex"
import { rootState } from "../"
import { ChatMessage, Instance } from '@/socket'

const MESSAGE_LIMIT = 100
const KILL_LIMIT = 100

export enum INSTANCE {
  ADD = "INSTANCE_ADD",
  DEL = "INSTANCE_DEL",
  UPDATE = "INSTANCE_UPDATE",
  ADD_CHAT = "INSTANCE_ADD_CHAT",
  ADD_KILL = "INSTANCE_ADD_KILL"
}

export enum INSTANCE_MUTATION {
  ADD = "INSTANCE_MUTATION_ADD",
  DEL = "INSTANCE_MUTATION_DEL",
  UPDATE = "INSTANCE_MUTATION_UPDATE",
  ADD_CHAT = "INSTANCE_MUTATION_ADD_CHAT",
  ADD_KILL = "INSTANCE_MUTATION_ADD_KILL"
}


export type InstanceState = {
  instances: Instance[],
  messages: { id: number, messages: ChatMessage[] }[]
}

const state = () => ({
  instances: [],
  messages: []
} as InstanceState)


const actions: ActionTree<InstanceState, rootState> = {
  [INSTANCE.ADD]({ commit }, instance) {
    commit(INSTANCE_MUTATION.ADD, instance)
  },
  [INSTANCE.DEL]({ commit }, props) {
    commit(INSTANCE_MUTATION.DEL, props)
  },
  [INSTANCE.UPDATE]({ commit }, { changes, id }) {
    changes.forEach((change: any) => commit(INSTANCE_MUTATION.UPDATE, { id, change })) 
  },
  [INSTANCE.ADD_CHAT]({ commit }, { messages }: { messages: ChatMessage[] }) {
    messages.forEach(message => commit(INSTANCE_MUTATION.ADD_CHAT, { message }))
  }
}

const mutations: MutationTree<InstanceState> = {
  [INSTANCE_MUTATION.ADD](state, instance) {
    if (state.instances.some(({ id }) => id === instance.id)) return
    state.instances.push(instance)
  },
  [INSTANCE_MUTATION.DEL](state, { id }) {
    state.instances = state.instances.filter(instance => instance.id === id)
  },
  [INSTANCE_MUTATION.UPDATE](state, { id, change }) {
    const instance = state.instances.find(instance => instance.id === id)
    if (!instance) return
    let obj: any = instance
    const path = change[0].split(".")
    path.forEach((key: string, index: number) => {
      if (index === path.length - 1) {
        obj[key] = change[1]
      } else {
        obj = obj[key]
      }
    })
  },
  [INSTANCE_MUTATION.ADD_CHAT](state, { message }: { message: ChatMessage}) {
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
  state: state(),
  actions,
  mutations,
  getters
}

export default store