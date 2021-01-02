import api, { VeniceRcon } from "../../api"
import { Module, MutationTree, GetterTree } from "vuex"
import { rootState } from "../"

export enum AUTH {
  UPDATE_TOKEN = "AUTH_UPDATE_TOKEN",
  UPDATE_WHOAMI = "AUTH_UPDATE_WHOAMI",
  LOGOUT = "AUTH_LOGOUT"
}

export type AuthState = {
  token: string|null
  whoami: VeniceRcon.WhoamiResponse|null
}

function defaultState(): AuthState {
  return {
    token: localStorage.getItem("jwt") || null,
    whoami: null
  }
}

const mutations: MutationTree<AuthState> = {
  [AUTH.UPDATE_TOKEN](state, token: string) {
    localStorage.setItem("jwt", token)
    state.token = token
  },
  [AUTH.UPDATE_WHOAMI](state, response: VeniceRcon.WhoamiResponse) {
    state.whoami = response
  },
  [AUTH.LOGOUT](state) {
    localStorage.removeItem("jwt")
    Object.assign(state, defaultState())
  }
}

const getters: GetterTree<AuthState, rootState> = {
  loggedIn: state => state.whoami !== null,
  hasPermission: state => (id: number|undefined, scope: string) => {
    if (!state.whoami) return false
    return state.whoami.permissions.some(node => {
      if (node.root || node.instance === id)
        return node.scopes.includes(scope)
    })
  }
}

const store: Module<AuthState, rootState> = {
  state: defaultState(),
  mutations,
  getters
}

export default store