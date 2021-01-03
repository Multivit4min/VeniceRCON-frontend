import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import Main from "../../views/main/Main.vue"
import Dashboard from "../../views/main/Dashboard.vue"
import Instance from "../../views/main/Instance.vue"
import Logout from "../../views/auth/Logout.vue"
import Login from "../../views/auth/Login.vue"
import PlayerList from "../../views/main/instance/PlayerList.vue"
import Variables from "../../views/main/instance/Variables.vue"
import store from "../store"

const routes: RouteRecordRaw[] = [{
  path: "/",
  name: "Home",
  component: Main,
  redirect: "/dashboard",
  children: [{
    path: "/:instanceId",
    name: "Instance",
    component: Instance,
    redirect: to => `${to.fullPath}/players`,
    children: [{
      path: "players",
      name: "PlayerList",
      component: PlayerList
    }, {
      path: "variables",
      name: "Variables",
      component: Variables
    }]
  }, {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard
  }]
}, {
  path: "/login",
  name: "Login",
  component: Login,
}, {
  path: "/logout",
  name: "Logout",
  component: Logout
}]

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
  return new Promise<void>(fulfill => {
    if (store.state.app.initialized) return fulfill()
    const unsubscribe = store.watch(state => state.app.initialized, init => {
      if (!init) return
      unsubscribe()
      fulfill()
    })
  })
}

export default router
