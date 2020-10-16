import { rootState } from "../src/services/store"
import { Router } from "vue-router"
import { Store } from "vuex"

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $router: Router
    $store: Store<rootState>
    $toast: {
      add: (opts: {
        severity: "success"|"info"|"warn"|"error",
        summary: string,
        detail: string,
        closeable?: boolean
        life?: number
      }) => void
    }
  }
}