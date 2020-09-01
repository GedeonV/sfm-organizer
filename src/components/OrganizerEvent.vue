<template>
  <div>
    <h1 class="title">{{ event_data.event_name }}</h1>
    <p>Description : {{ event_data.description }}</p>
    <p>Date : {{ event_data.date }}</p>
    <p>Theme : {{ event_data.theme }}</p>
    <p>Code : {{ event_data.event_code }}</p>
    <p>State: {{ event_data.state }}</p>
    <hr />
    <h2 class="title">Inscriptions</h2>
    <ul>
      <li v-for="item in this.event_data.users" v-bind:key="item._id">
        {{ item }}
        <a @click="deleteUser(item._id)">
          <span class="icon has-text-danger">
            <i class="fas fa-trash-alt"></i>
          </span>
        </a>
      </li>
    </ul>
    <hr />
    <h2 class="title">Chansons</h2>
    <input type="file" @change="loadFile" name="file" />
    <hr />
    <div v-if="event_data.state == 0">
      <div class="field">
        <div class="control">
          <button @click="startEvent()" class="button is-link">Lancer</button>
        </div>
      </div>
    </div>
    <div v-if="event_data.state == 1">
      <div class="field">
        <div class="control">
          <button @click="endEvent()" class="button is-danger">Stopper</button>
        </div>
      </div>
    </div>
    <div v-if="event_data.state == 2">
      <div class="field">
        <div class="control">
          <button @click="startEvent()" class="button is-success">Recommencer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrganizerEvent",
  methods: {
    startEvent() {
      axios
        .put("parties/event/" + this.$route.params.id + "/state", { state: 1 })
        .then((response) => {
          console.log(response.data);
          this.loadEvent();
        });
    },

    endEvent() {
      axios
        .put("parties/event/" + this.$route.params.id + "/state", { state: 2 })
        .then((response) => {
          console.log(response.data);
          this.loadEvent();
        });
    },

    loadFile(af) {
      const file = af.target.files[0];
      const reader = new FileReader();
      console.log(file);
      reader.onload = (e) => this.$emit("load", e.target.result);
    },
    loadEvent() {
      axios.get("parties/event/" + this.$route.params.id).then((response) => {
        this.event_data = response.data;
        console.log(this.event_data);
      });
    },

    deleteUser(id) {
      axios
        .post("parties/event/" + this.$route.params.id + "/remove", {
          userId: id,
        })
        .then((response) => {
          console.log(response.data);
          this.loadEvent();
        });
    },
  },
  data() {
    return {
      event_data: {},
    };
  },
  watch: {
    $route(to, from) {},
  },
  mounted() {
    if (this.$route.params.id) {
      this.loadEvent();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.modal {
  z-index: 1000;
}
</style>
