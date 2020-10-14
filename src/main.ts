import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import "./socket"
import ToastService from "primevue/toastservice"
import Toast from "primevue/toast"

import "primevue/resources/themes/saga-blue/theme.css"
import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css"

const app = createApp(App)

app.component("Toast", Toast)

app.use(store)
  .use(router)
  .use(ToastService)
  .mount("#app")