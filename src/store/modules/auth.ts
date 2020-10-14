import { login, whoami, WhoamiResponse } from "@/api"
import { Module, ActionTree, MutationTree, GetterTree } from "vuex"
import { rootState } from "../"
import { APP } from './app'

export enum AUTH {
  LOGIN = "AUTH_LOGIN",
  WHOAMI = "AUTH_WHOAMI",
  LOGOUT = "AUTH_LOGOUT"
}

export type AuthState = {
  token: string|null
  whoami: WhoamiResponse|null
}

function defaultState(): AuthState {
  return {
    token: localStorage.getItem("jwt") || null,
    whoami: null
  }
}


const actions: ActionTree<AuthState, rootState> = {
  /** tries to login to a different account */
  async [AUTH.LOGIN]({ dispatch, commit }, payload) {
    const { token } = await login(payload)
    commit("updateToken", token)
    await dispatch(AUTH.WHOAMI)
  },
  /** retrieves informations about the currently used user */
  async [AUTH.WHOAMI](context) {
    context.commit("updateWhoami", await whoami())
  },
  /** resets the store */
  [AUTH.LOGOUT]({ commit }) {
    commit(AUTH.LOGOUT)
  }
}

const mutations: MutationTree<AuthState> = {
  updateToken(state, token: string) {
    localStorage.setItem("jwt", token)
    state.token = token
  },
  updateWhoami(state, response: WhoamiResponse) {
    state.whoami = response
  },
  [AUTH.LOGOUT](state) {
    localStorage.removeItem("jwt")
    Object.assign(state, defaultState())
  }
}

const getters: GetterTree<AuthState, rootState> = {
  loggedIn: state => state.whoami !== null
}

const store: Module<AuthState, rootState> = {
  state: defaultState(),
  actions,
  mutations,
  getters
}

export default store