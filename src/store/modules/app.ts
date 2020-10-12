import { Module, ActionTree, MutationTree } from "vuex"
import type { rootState } from "../"
import { AUTH } from './auth'

export enum APP {
  INITIALIZE = "APP_INITIALIZE"
}

export type AppState = {
  initialized: boolean
  apiEndpoint: string
}

export const state = () => ({
  initialized: false,
  apiEndpoint: "http://localhost:8000",
} as AppState)

const actions: ActionTree<AppState, rootState> = {
  /** initializes the application */
  async [APP.INITIALIZE]({ dispatch, commit, rootState }) {
    console.log({ rootState })
    //@ts-ignore
    if (!rootState.auth.token) return commit("setInitialized")
    try {
      await dispatch(AUTH.WHOAMI)
      commit("setInitialized")
    } catch (e) {
      console.error(e)
      await dispatch(AUTH.LOGOUT)
      commit("setInitialized")
    }
  }
}

const mutations: MutationTree<AppState> = {
  setInitialized(state, trigger: boolean = true) {
    state.initialized = trigger
  }
}

const store: Module<AppState, rootState> = {
  state: state(),
  actions,
  mutations
}

export default store