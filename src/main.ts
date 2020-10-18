import { createApp } from "vue"
import App from "./App.vue"
import router from "./services/router"
import store from "./services/store"
import "./services/socket"

import PermissionCheck from "./components/PermissionCheck.vue"

import "primeflex/primeflex.css"
import "primevue/resources/themes/bootstrap4-light-blue/theme.css"
import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css"


import ToastService from "primevue/toastservice"
import Toast from "primevue/toast"
import Card from "primevue/card"
import Button from "primevue/button"
import SplitButton from "primevue/splitbutton"
import InputNumber from "primevue/inputnumber"
import InputText from "primevue/inputtext"
import InputSwitch from "primevue/inputswitch"

export const app = createApp(App)

app.component("Toast", Toast)
app.component("Card", Card)
app.component("Button", Button)
app.component("SplitButton", SplitButton)
app.component("InputNumber", InputNumber)
app.component("InputText", InputText)
app.component("InputSwitch", InputSwitch)
app.component("PermissionCheck", PermissionCheck)

app
  .use(store)
  .use(router)
  .use(ToastService)
  .mount("#app")