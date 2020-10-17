import store from "../store"
//@ts-ignore
import { useToast } from "primevue/usetoast"
import { ErrorCodes } from 'vue'

export function get(route: string, params?: Record<string, string>) {
  return handleResponse(fetch(getRoute(route, params).toString(), {
    method: "GET",
    headers: defaultHeaders(),
    credentials: "include",
  }))
}

export function post(route: string, body?: any, params?: Record<string, string>) {
  return handleResponse(fetch(getRoute(route, params).toString(), {
    method: "POST",
    body: JSON.stringify(body),
    headers: defaultHeaders(() => {
      const headers: Record<string, string> = {}
      if (body) headers["Content-Type"] = "application/json"
      return headers
    }),
    credentials: "include",
  }))
}

export function patch(route: string, body?: any, params?: Record<string, string>) {
  return handleResponse(fetch(getRoute(route, params).toString(), {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: defaultHeaders(() => {
      const headers: Record<string, string> = {}
      if (body) headers["Content-Type"] = "application/json"
      return headers
    }),
    credentials: "include",
  }))
}

export function remove(route: string, params?: Record<string, string>) {
  return handleResponse(fetch(getRoute(route, params).toString(), {
    method: "DELETE",
    headers: defaultHeaders(),
    credentials: "include",
  }))
}

/**
 * error handler
 * @param response fetch response
 */
async function handleResponse(response: Promise<Response>) {
  try {
    const res = await response
    if (res.status > 299 || res.status < 200) {
      const error = <any>new Error(`${res.statusText} (${res.status})`)
      error.status = res.status
      error.statusText = res.statusText
      if (res.headers.get("Content-Type") === "application/json") error.body = await res.json()
      useToast().add({
        severity: "error",
        detail: (error.body && error.body.message) ? error.body.message : error.message,
        summary: `HTTP Error`,
        life: 4000
      })
      throw error
    }
    return res
  } catch (error) {
    console.log(error)
    useToast().add({
      severity: "error",
      detail: error.message,
      summary: `HTTP Error`,
      life: 4000
    })
    throw error
  }
}

/**
 * applies some default headers to each request
 * @param headers preset headers which should be included
 */
function defaultHeaders(headers: Record<string, string>|(() => Record<string, string>) = {}) {
  const defaults: Record<string, string> = {}
  const { token } = store.state.auth
  if (token) defaults["Authorization"] = `Bearer ${token}`
  if (typeof headers === "function") headers = headers()
  return {
    ...headers,
    ...defaults
  }
}

/**
 * gets the actual path to the api endpoint
 * @param path path to the api
 * @param params optional url params
 */
function getRoute(path: string, params: Record<string, string> = {}) {
  if (path.startsWith("/")) path = path.slice(1)
  const { app } = store.state
  const url = new URL(`${app.endpoints[app.endpoint]}/api/${path}`)
  Object.keys(params).forEach(key => {
    url.searchParams.set(key, params[key])
  })
  return url
}