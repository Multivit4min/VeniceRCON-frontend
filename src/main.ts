import { createApp } from "vue"
import App from "./App.vue"
import router from "./services/router"
import store from "./services/store"

import PermissionCheck from "./components/PermissionCheck.vue"

import "primeflex/primeflex.css"
import "primevue/resources/themes/bootstrap4-light-blue/theme.css"
import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css"


import ToastService from "primevue/toastservice"
import ConfirmationService from "primevue/confirmationservice"
import Toast from "primevue/toast"
import Card from "primevue/card"
import Button from "primevue/button"
import SplitButton from "primevue/splitbutton"
import InputNumber from "primevue/inputnumber"
import InputText from "primevue/inputtext"
import Dropdown from "primevue/dropdown"
import Dialog from "primevue/dialog"
import Menu from "primevue/menu"
import Toolbar from "primevue/toolbar"


export const app = createApp(App)
  .component("Toast", Toast)
  .component("Card", Card)
  .component("Button", Button)
  .component("SplitButton", SplitButton)
  .component("InputNumber", InputNumber)
  .component("InputText", InputText)
  .component("Dropdown", Dropdown)
  .component("Dialog", Dialog)
  .component("Menu", Menu)
  .component("Toolbar", Toolbar)
  .component("PermissionCheck", PermissionCheck)
  .use(store)
  .use(router)
  .use(ToastService)
  .use(ConfirmationService)
  .mount("#app")