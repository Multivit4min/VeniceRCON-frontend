import { rootState } from "@/store"
import { Vue } from "vue-class-component"
import { Router } from 'vue-router'
import { Store } from 'vuex'

export abstract class VueComponent extends Vue {
  readonly $router!: Router
  readonly $store!: Store<rootState>
  readonly $toast!: {
    add: (opts: {
      severity: "success"|"info"|"warn"|"error",
      summary: string,
      detail: string,
      closeable?: boolean
      life?: number
    }) => void
  }
}