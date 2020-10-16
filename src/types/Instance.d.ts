
export interface Instance {
  id: number,
  host: string,
  port: number,
  version: "BF3"|"VU",
  state: number,
  serverinfo: {
    name: string,
    slots: number,
    totalSlots: number,
    mode: string,
    map: string,
    roundsPlayed: number,
    roundsTotal: number,
    scores: number[],
    targetScore: number,
    onlineState: string,
    ranked: false,
    punkBuster: false,
    password: false,
    uptime: number,
    roundTime: number,
    address: string,
    punkBusterVersion: string,
    joinQueueEnabled: false,
    region: string,
    closestPingSite: string,
    country: string,
    matchmaking: false
  },
  players: [],
  maps: MapInfo[],
  vars: Record<string, number|string|boolean>,
  mapInfo: { index: number, next: number }
}

export interface MapInfo {
  map: string,
  mode: string,
  rounds: number,
  index: number
}