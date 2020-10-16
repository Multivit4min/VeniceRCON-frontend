import { patch } from "./api"

/** starts the selected instance id */
export async function start(instance: number): Promise<void> {
  await patch(`/instances/${instance}/start`)
}

/** stops the selected instance id */
export async function stop(instance: number): Promise<void> {
  await patch(`/instances/${instance}/stop`)
}