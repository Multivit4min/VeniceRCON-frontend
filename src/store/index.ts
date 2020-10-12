import { createStore } from "vuex"
import authStore, { AuthState } from "./modules/auth"
import appStore, { AppState } from "./modules/app"

export type rootState = {
  auth: AuthState,
  app: AppState
}

const store = createStore({
  strict: true,
  state: {} as rootState,
  modules: {
    auth: authStore,
    app: appStore
  }
})

export default store