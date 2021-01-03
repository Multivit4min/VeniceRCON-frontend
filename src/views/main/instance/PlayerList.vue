<template>
  <div class="p-grid" v-if="selectedPlayer">
    <div class="p-col">
      <Card>
        <template #title>
          Player actions: {{selectedPlayer.name}}
        </template>
        <template #content>
          <pre>{{JSON.stringify(selectedPlayer)}}</pre>
        </template>
        <template #footer>
          <Button
            @click="selectedPlayer = undefined"
            icon="pi pi-times"
            class="p-button-warning p-button-sm"
            style="margin-left: .5em"
            label="Cancel"
          />
        </template>
      </Card>
    </div>
  </div>
  <div class="p-grid">
    <div v-for="team in teams" :key="team.id" class="p-col-6">
      <Card>
        <template #title>
          Team {{team.name}} - {{team.score}}
        </template>
        <template #content>
          <DataTable
            v-model:selection="selectedPlayer"
            class="p-datatable-sm"
            :value="team.players"
            selectionMode="single"
            dataKey="name"
          >
            <Column field="name" header="Name"></Column>
            <Column field="squad" header="Squad"></Column>
            <Column field="score" header="Score"></Column>
            <Column field="kills" header="Kills"></Column>
            <Column field="deaths" header="Deaths"></Column>
            <Column field="kd" header="KD"></Column>
            <Column field="ping" header="Ping" suffix="ms">
              <template #body="props">
                {{props.data.ping}}ms
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue"
import { useStore } from "vuex"
import { squad } from "../../../services/battlefield/squad"
import { team } from "../../../services/battlefield/team"

export default defineComponent({
  data() {
    return {
      store: useStore(),
      sort: { field: "score", order: -1 },
      selectedPlayer: undefined
    }
  },
  computed: {
    instance(props) {
      return props.store.getters.selectedInstance
    },
    teams(props) {
      const teams = props.instance.serverinfo.scores.map((score, index) => ({
        id: index+1, name: team[index+1], score: score.toFixed(0), players: []
      }))
      Object.values(props.instance.players)
        .filter(players => players.teamId > 0)
        .forEach(player => {
          teams[player.teamId-1].players.push(props.player(player))
        })
      teams.forEach(team => {
        team.players = team.players.sort((a, b) => {
          if (props.sort.order < 0) {
          return b[props.sort.field] - a[props.sort.field]
          } else if (props.sort.order > 0) {
          return a[props.sort.field] - b[props.sort.field]
          } else {
            return 0
          }
        })
      })
      return teams
    }
  },
  methods: {
    player: player => {
      let kd = 0
      if (player.deaths === 0) {
        kd = player.kills
      } else {
        kd = player.kills / player.deaths 
      }
      kd = kd.toFixed(2)
      return {
        ...player,
        squad: squad[player.squadId],
        kd
      }
    },
    setSort(field) {
      console.log(field)
    }
  }
})
</script>