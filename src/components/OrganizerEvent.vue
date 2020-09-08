<template>
  <div>
    <h1 class="title">{{ event_data.event_name }}</h1>
    <p>Description : {{ event_data.description }}</p>
    <p>Date : {{ event_data.date }}</p>
    <p>Theme : {{ event_data.theme }}</p>
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
    <label class="label">Ajouter une musique au catalogue</label>
    <div class="field has-addons is-grouped">
      <div class="file has-name">
        <label class="file-label">
          <input
            class="file-input"
            @change="loadFile"
            type="file"
            name="resume"
            :disabled="isSending === 1"
          />
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <span class="file-label">Choisir un fichier</span>
          </span>
          <span v-if="isEmpty" class="file-name">{{ this.file.name }}</span>
          <span v-else class="file-name">Aucun fichier choisi</span>
        </label>
      </div>

      <div v-if="isSending === 0" class="control">
        <a @click="submitFile()" class="button is-info">
          Envoyer
        </a>
      </div>

      <div v-if="isSending === 1" class="control">
        <a class="button is-info">
          Envoi en cours
          <div class="ld ld-ring ld-spin " style="margin-left: 5px;"></div>
        </a>
      </div>

      <div v-if="isSending === 2" class="control">
        <a class="button is-success">
          Fichier Envoyer
          <i class="fas fa-check" style="margin-left: 5px ;"></i>
        </a>
      </div>

      <div v-if="isSending === 3" class="control">
        <a class="button is-danger">
          Erreur
          <i class="fas fa-times" style="margin-left: 5px ;"></i>
        </a>
      </div>
    </div>

    <label class="label">Chansons selectionnée</label>
    <ul>
      <li v-for="item in this.event_data.songs" v-bind:key="item._id">
        {{ item }}
        <a @click="deleteSong(item._id)">
          <span class="icon has-text-danger">
            <i class="fas fa-trash-alt"></i>
          </span>
        </a>
      </li>
    </ul>
    <label class="label">Catalogue</label>
    <ul>
      <li v-for="item in this.songsList" :key="item._id">
        {{ item
        }}<a @click="addSong(item._id)">
          <span class="icon has-text-success">
            <i class="fas fa-plus"></i>
          </span>
        </a>
      </li>
    </ul>

    <hr />

    <h2 class="title">QRCode</h2>
    <qrcode :value="this.$route.params.id" :options="{ width: 200 }"></qrcode>

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
          <button @click="startEvent()" class="button is-success">
            Recommencer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrganizerEvent",
  data() {
    return {
      event_data: {},
      songsList: {},
      file: {},
      songTags: null,
      isEmpty: false,
      songsList: null,
      isSending: 0,
    };
  },
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
      jsmediatags.read(file, {
        onSuccess: (tag) => {
          console.log(tag.tags);
          this.isSending = 0;
          this.songTags = new FormData();
          this.songTags.append("title", tag.tags.title);
          this.songTags.append("artist", tag.tags.artist);
          this.songTags.append("album", tag.tags.album);
          this.songTags.append("date", tag.tags.year);
          this.songTags.append("songFile", this.file);
        },
        onError: (error) => {
          console.log("jsmediatags_error: " + error);
          this.isSending = 3;
        },
      });
      this.file = file;
      this.isEmpty = true;
      reader.onload = (e) => {
        this.$emit("load", e.target.result);
      };
    },

    submitFile() {
      this.isSending = 1;
      console.log(this.songTags);
      axios
        .post("/songs/upload", this.songTags, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.error) {
            this.isSending = 3;
          } else {
            this.isSending = 2;
            console.log(response.data.song._id);
            this.addSong(response.data.song._id);
            this.loadSongs();
          }
        })
        .catch((err) => {
          console.log(err);
          this.isSending = 3;
        });
    },

    loadEvent() {
      axios.get("parties/event/" + this.$route.params.id).then((response) => {
        this.event_data = response.data.event;
        console.log(this.event_data);
      });
    },

    loadSongs() {
      axios
        .get("songs/")
        .then((response) => {
          this.songsList = response.data.songs;
          console.log(this.songsList);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    deleteUser(id) {
      axios
        .post("parties/event/" + this.$route.params.id + "/unsub_user", {
          userId: id,
        })
        .then((response) => {
          console.log(response.data);
          this.loadEvent();
        });
    },

    addSong(id) {
      axios
        .post("parties/event/" + this.$route.params.id + "/song", {
          songId: id,
        })
        .then((response) => {
          console.log(response.data);
          this.loadEvent();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    deleteSong(id) {
      axios
        .post("parties/event/" + this.$route.params.id + "/remove_song", {
          songId: id,
        })
        .then((response) => {
          console.log(response.data);
          this.loadEvent();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  watch: {
    $route(to, from) {},
  },
  mounted() {
    if (this.$route.params.id) {
      this.loadEvent();
      this.loadSongs();
      let header = document.createElement("script");
      header.setAttribute(
        "src",
        "https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.3/jsmediatags.min.js"
      );
      document.head.appendChild(header);
      window.onbeforeunload = () => {
        if (this.isSending == 1) {
          return "";
        }
      };
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
