import { createStore } from "vuex"
import authStore, { AuthState } from "./modules/auth"
import appStore, { AppState } from "./modules/app"
import instanceStore, { InstanceState } from "./modules/instances"

export type rootState = {
  auth: AuthState,
  app: AppState,
  instances: InstanceState
}

const store = createStore({
  strict: true,
  state: {} as rootState,
  modules: {
    auth: authStore,
    app: appStore,
    instances: instanceStore
  }
})

export default store