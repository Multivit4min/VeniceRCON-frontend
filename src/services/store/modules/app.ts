import { Module, ActionTree, MutationTree, GetterTree } from "vuex"
import type { rootState } from "../"
import api from '../../api'
import { AUTH } from './auth'

const DEFAULT_ENDPOINT = "http://localhost:8000"

export enum APP {
  INITIALIZE = "APP_INITIALIZE",
  ADD_LOCATION = "APP_ADD_LOCATION",
  DEL_LOCATION = "APP_DEL_LOCATION",
  SELECT_ENDPOINT = "APP_SELECT_ENDPOINT",
  MESSAGE = "APP_MESSAGE"
}

export type AppState = {
  initialized: boolean
  endpoints: string[]
  endpoint: number
  message: {
    type: string
    content: string
  }|null
}

function getEndpoints(): Pick<AppState, "endpoint"|"endpoints"> {
  const store = localStorage.getItem("endpoints")
  let endpoints = store ? JSON.parse(store) : [DEFAULT_ENDPOINT]
  if (!Array.isArray(endpoints)) endpoints = [DEFAULT_ENDPOINT]
  const endpoint = parseInt(localStorage.getItem("endpoint") || "0" , 10)
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
  async [APP.INITIALIZE]({ dispatch, commit, rootState }) {
    if (!rootState.auth.token) return commit(APP.INITIALIZE)
    try {
      await api.whoami()
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
    const index = state.endpoints.reduce((a, v, i) => v === props.name ? i : a, 0)
    state.endpoint = index
    localStorage.setItem("endpoint", index.toString(10))
  },
  [APP.ADD_LOCATION](state, props: { url: string }) {
    console.log(state, state.endpoints)
    if (state.endpoints.includes(props.url)) return
    state.endpoint = state.endpoints.push(props.url) - 1
    localStorage.setItem("endpoints", JSON.stringify(state.endpoints))
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