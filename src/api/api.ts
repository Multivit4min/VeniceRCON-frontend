import store from "../store"

export function get(route: string, params?: Record<string, string>) {
  return handleResponse(fetch(getRoute(route, params).toString(), {
    method: "GET",
    headers: defaultHeaders(),
    credentials: "include",
  }))
}

export function post(route: string, body: any, params?: Record<string, string>) {
  return handleResponse(fetch(getRoute(route, params).toString(), {
    method: "POST",
    body: JSON.stringify(body),
    headers: defaultHeaders({
      "Content-Type": "application/json"
    }),
    credentials: "include",
  }))
}

export function patch() {
  
}

export function remove() {

}

/**
 * error handler
 * @param response fetch response
 */
async function handleResponse(response: Promise<Response>) {
  const res = await response
  if (res.status > 299 || res.status < 200) {
    const error = <any>new Error(`${res.statusText} (${res.status})`)
    error.status = res.status
    error.statusText = res.statusText
    if (res.headers.get("Content-Type") === "application/json") error.body = await res.json()
    throw error
  }
  return res
}

/**
 * applies some default headers to each request
 * @param headers preset headers which should be included
 */
function defaultHeaders(headers: Record<string, string> = {}) {
  const defaults: Record<string, string> = {}
  const { token } = store.state.auth
  if (token) defaults["Authorization"] = `Bearer ${token}`
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
  const url = new URL(`${store.state.app.apiEndpoint}/api/${path}`)
  Object.keys(params).forEach(key => {
    url.searchParams.set(key, params[key])
  })
  return url
}