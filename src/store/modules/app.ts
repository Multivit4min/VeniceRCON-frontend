import { Module, ActionTree, MutationTree, GetterTree } from "vuex"
import type { rootState } from "../"
import { AUTH } from './auth'

export enum APP {
  INITIALIZE = "APP_ACTION_INITIALIZE",
  ADDLOCATION = "APP_ACTION_APILOCATION",
  USE_ENDPOINT = "APP_ACTION_USE_ENDPOINT"
}

export enum APPMUTATE {
  SET_INITIALIZED = "APP_MUTATE_SET_INITIALZED",
  SET_ENDPOINT = "APP_MUTATE_SET_ENDPOINT",
  ADD_API_LOCATION = "APP_MUTATE_ADD_API_LOCATION",
  DEL_API_LOCATION = "APP_MUTATE_DEL_API_LOCATION"
}

export const DEFAULT_ENDPOINT = "default"

export type AppState = {
  initialized: boolean
  endpoints: Record<string, string>
  endpoint: string
}

function getEndpoints() {
  const store = localStorage.getItem("endpoints")
  const endpoints = store ? JSON.parse(store) : { [DEFAULT_ENDPOINT]: "http://localhost:8000" }
  const endpoint = localStorage.getItem("endpoint") || DEFAULT_ENDPOINT
  return { endpoints, endpoint }
}

export const state = () => ({
  initialized: false,
  ...getEndpoints()
} as AppState)

const actions: ActionTree<AppState, rootState> = {
  /** initializes the application */
  async [APP.INITIALIZE]({ dispatch, commit, rootState }) {
    console.log({ rootState })
    if (!rootState.auth.token) return commit(APPMUTATE.SET_INITIALIZED)
    try {
      await dispatch(AUTH.WHOAMI)
      commit(APPMUTATE.SET_INITIALIZED)
    } catch (e) {
      console.error(e)
      await dispatch(AUTH.LOGOUT)
      commit(APPMUTATE.SET_INITIALIZED)
    }
  },
  async [APP.ADDLOCATION]({ commit }, props) {
    commit(APPMUTATE.ADD_API_LOCATION, props)
  },
  async [APP.USE_ENDPOINT]({ commit, dispatch }, props) {
    this.dispatch(AUTH.LOGOUT)
    this.commit(APPMUTATE.SET_ENDPOINT)
  }
}

const mutations: MutationTree<AppState> = {
  [APPMUTATE.SET_INITIALIZED](state, trigger: boolean = true) {
    state.initialized = trigger
  },
  [APPMUTATE.SET_ENDPOINT](state, props: { name: string }) {
    state.endpoint = props.name
    localStorage.setItem("endpoint", props.name)
  },
  [APPMUTATE.ADD_API_LOCATION](state, props: { name: string, location: string }) {
    state.endpoints[props.name] = props.location
    localStorage.setItem("endpoints", JSON.stringify(state.endpoints))
  },
  [APPMUTATE.DEL_API_LOCATION](state, props: { name: string }) {
    if (props.name === DEFAULT_ENDPOINT) throw new Error("can not delete default location")
    delete state.endpoints[name]
    if (state.endpoint === name) state.endpoint = DEFAULT_ENDPOINT
  }
}

const getters: GetterTree<AppState, rootState> = {
  apiEndpointUrl: state => state.endpoints[state.endpoint]
}

const store: Module<AppState, rootState> = {
  state: state(),
  actions,
  mutations,
  getters
}

export default store