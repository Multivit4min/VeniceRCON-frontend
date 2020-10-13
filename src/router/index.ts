import { createRouter, createWebHashHistory, RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from "vue-router"
import Dashboard from "../views/Dashboard.vue"
import Logout from "../views/auth/Logout.vue"
import Login from "../views/auth/Login.vue"
import store from '@/store'

/**
 * checks if the user is logged in or not and redirects him to a specified route
 * @param redirect redirect if stuff goes wrong
 * @param requireLoggedIn wther the user should be logged in or not
 */
function loggedInGuard(redirect: string, requireLoggedIn: boolean = true) {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    if (requireLoggedIn) {
      store.getters.loggedIn ? next() : next(redirect)
    } else {
      store.getters.loggedIn ? next(redirect) : next()
    }
  }
}

const routes: RouteRecordRaw[] = [{
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    beforeEnter: loggedInGuard("/login")
  }, {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: loggedInGuard("/", false)
  }, {
    path: "/logout",
    name: "Logout",
    component: Logout
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
