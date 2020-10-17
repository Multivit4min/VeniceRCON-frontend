import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import Main from "../../views/main/Main.vue"
import Dashboard from "../../views/main/Dashboard.vue"
import Instance from "../../views/main/Instance.vue"
import Logout from "../../views/auth/Logout.vue"
import Login from "../../views/auth/Login.vue"
import store from "../store"

const routes: RouteRecordRaw[] = [{
  path: "/:instanceId(\\d+)",
  name: "Instance" ,
  component: Instance,
  children: [
    
  ]
  }, {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard
  }, {
    path: "/login",
    name: "Login",
    component: Login,
  }, {
    path: "/logout",
    name: "Logout",
    component: Logout
  }, {
    path: "/",
    redirect: { path: "/dashboard" }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  await waitInitialized()
  if (to.name === "Login" && store.getters.loggedIn) return next({ path: "/" })
  if (to.name !== "Login" && !store.getters.loggedIn) return next({ path: "/login" })
  next()
})

function waitInitialized() {
  if (store.state.app.initialized) return Promise.resolve()
  return new Promise(fulfill => {
    if (store.state.app.initialized) return fulfill()
    const unsubscribe = store.watch(state => state.app.initialized, init => {
      if (!init) return
      unsubscribe()
      fulfill()
    })
  })
}

export default router
