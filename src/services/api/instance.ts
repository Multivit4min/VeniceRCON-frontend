import { patch, remove, post } from "./api"

/** starts the selected instance id */
export async function start(instance: number): Promise<void> {
  await patch(`/instances/${instance}/start`)
}

/** stops the selected instance id */
export async function stop(instance: number): Promise<void> {
  await patch(`/instances/${instance}/stop`)
}

export interface CreateInstanceProps {
  test?: boolean
  host: string
  port: number
  password: string
}

/** creates a new instance */
export async function createInstance(props: CreateInstanceProps): Promise<Response> {
  return post("/instances", {
    test: props.test === true,
    host: props.host,
    port: props.port,
    password: props.password
  })
}

/** deletes the instance */
export async function deleteInstance(instance: number): Promise<void> {
  await remove(`/instances/${instance}`)
}