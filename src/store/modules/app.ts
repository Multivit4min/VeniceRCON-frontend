import { Module, ActionTree, MutationTree, GetterTree } from "vuex"
import type { rootState } from "../"
import { AUTH } from './auth'

export enum APP {
  INITIALIZE = "APP_INITIALIZE",
  ADD_LOCATION = "APP_ADD_LOCATION",
  DEL_LOCATION = "APP_DEL_LOCATION",
  SELECT_ENDPOINT = "APP_SELECT_ENDPOINT",
  MESSAGE = "APP_MESSAGE"
}

export const DEFAULT_ENDPOINT = "default"

export type AppState = {
  initialized: boolean
  endpoints: Record<string, string>
  endpoint: string
  message: {
    type: string
    content: string
  }|null
}

function getEndpoints(): Pick<AppState, "endpoint"|"endpoints"> {
  const store = localStorage.getItem("endpoints")
  const endpoints = store ? JSON.parse(store) : { [DEFAULT_ENDPOINT]: "http://localhost:8000" }
  const endpoint = localStorage.getItem("endpoint") || DEFAULT_ENDPOINT
  return { endpoints, endpoint }
}

export function defaultState(): AppState {
  return {
    initialized: false,
    ...getEndpoints(),
    message: null
  }
}

const actions: ActionTree<AppState, rootState> = {
  /** initializes the application */
  async [APP.INITIALIZE]({ dispatch, commit, rootState }) {
    if (!rootState.auth.token) return commit(APP.INITIALIZE)
    try {
      await dispatch(AUTH.WHOAMI)
      commit(APP.INITIALIZE)
    } catch (e) {
      await dispatch(AUTH.LOGOUT)
      commit(APP.INITIALIZE)
    }
  },
  async [APP.ADD_LOCATION]({ commit }, props) {
    commit(APP.ADD_LOCATION, props)
  },
  async [APP.SELECT_ENDPOINT]({ commit, dispatch }) {
    dispatch(AUTH.LOGOUT)
    commit(APP.SELECT_ENDPOINT)
  },
  [APP.MESSAGE]({ commit }, props) {
    commit(APP.MESSAGE, props)
  }
}

const mutations: MutationTree<AppState> = {
  [APP.INITIALIZE](state, trigger: boolean = true) {
    state.initialized = trigger
  },
  [APP.SELECT_ENDPOINT](state, props: { name: string }) {
    state.endpoint = props.name
    localStorage.setItem("endpoint", props.name)
  },
  [APP.ADD_LOCATION](state, props: { name: string, location: string }) {
    state.endpoints[props.name] = props.location
    localStorage.setItem("endpoints", JSON.stringify(state.endpoints))
  },
  [APP.DEL_LOCATION](state, props: { name: string }) {
    if (props.name === DEFAULT_ENDPOINT) throw new Error("can not delete default location")
    delete state.endpoints[name]
    if (state.endpoint === name) state.endpoint = DEFAULT_ENDPOINT
  },
  [APP.MESSAGE](state, { type, content }) {
    state.message = { type, content }
  }
}

const getters: GetterTree<AppState, rootState> = {
  apiEndpointUrl: state => state.endpoints[state.endpoint]
}

const store: Module<AppState, rootState> = {
  state: defaultState(),
  actions,
  mutations,
  getters
}

export default store