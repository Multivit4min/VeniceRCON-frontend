import { rootState } from "./store"
import { Store } from "vuex"

declare module "vue/types/vue" {

  interface Vue {
    $store: Store<rootState>
  }

}