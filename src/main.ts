import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import "./socket"

import "primeflex/primeflex.css"
import "primevue/resources/themes/bootstrap4-light-blue/theme.css"
import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css"


import ToastService from "primevue/toastservice"
import Toast from "primevue/toast"
import Card from "primevue/card"
import Button from "primevue/button"

const app = createApp(App)

app.component("Toast", Toast)
app.component("Card", Card)
app.component("Button", Button)

app.use(store)
  .use(router)
  .use(ToastService)
  .mount("#app")