<template>
  <div>
    <div class="container">
      <!-- //======= Description de l'évènement =======// -->
      <div class="event mt-6">
        <div class="desc">
          <h1 class="title mb-1">{{ event_data.event_name }}</h1>
          <p class="mb-4" v-if="event_data.state === 1">
            <span class="tag is-success">Evènement commencé</span>
          </p>
          <p class="mb-4" v-if="event_data.state === 0">
            <span class="tag is-link">Evènement non commencé</span>
          </p>
          <p class="mb-4" v-if="event_data.state === 2">
            <span class="tag is-danger">Evènement terminé</span>
          </p>
          <p>{{ event_data.description }}</p>
          <p>{{ getDate(event_data.date) }}</p>
          <p>Theme : {{ event_data.theme }}</p>

          <!-- //======= Boutton de lancement =======// -->
          <div class="launch mt-2">
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
        </div>

        <!-- //======= QRCode =======// -->
        <div class="qrcode">
          <h2 class="title">QRCode</h2>
          <div class="card">
            <div class="card-content">
              <qrcode :value="this.$route.params.id" :options="{ width: 200 }"></qrcode>
            </div>
          </div>
        </div>
      </div>
      <!-- //======= Liste d'inscrits =======// -->

      <div class="users mb-4">
        <h2 class="title">Inscriptions</h2>
        <table class="table is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th>#</th>
              <th>Chanteur</th>
              <th>Titre</th>
              <th>Artiste</th>
              <th>Désinscrire</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th>#</th>
              <th>Chanteur</th>
              <th>Titre</th>
              <th>Artiste</th>
              <th>Désinscrire</th>
            </tr>
          </tfoot>
          <tbody>
            <tr v-for="(item, index) in this.event_data.users" v-bind:key="item._id">
              <td>{{index}}</td>
              <td>{{item.first_name}} {{item.last_name}}}}</td>
              <td>{{item.songs.find(e => e._id === $route.params.id).song.title}}</td>
              <td>{{item.songs.find(e => e._id === $route.params.id).song.artist}}</td>
              <td>
                <a @click="deleteUser(item._id)">
                  <span class="icon has-text-danger">
                    <i class="fas fa-times"></i>
                  </span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- //======= Formulaire d'envoie de chansons =======// -->

      <div class="musics mb-6">
        <h2 class="title">Chansons</h2>
        <label class="label">Ajouter une musique au catalogue</label>
        <div class="field f-group has-addons is-grouped">
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
            <a
              @click="submitFile()"
              :disabled="isSending === 1 || isMissing === 1"
              class="button is-primary"
            >Envoyer</a>
          </div>

          <div v-if="isSending === 1" class="control">
            <a class="button is-info">
              Envoi en cours
              <div class="ld ld-ring ld-spin" style="margin-left: 5px;"></div>
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

        <!-- //======= Formulaire d'informations manquantes =======// -->

        <div class="mb-4" v-if="isMissing">
          <p>Informations manquantes</p>
          <div class="field">
            <label class="label">Titre</label>
            <div class="control">
              <input class="input" type="text" v-model="title" placeholder="Titre de la chanson" />
            </div>
          </div>
          <div class="field">
            <label class="label">Artiste</label>
            <div class="control">
              <input
                class="input"
                type="text"
                v-model="artist"
                placeholder="Interprète de la chanson"
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Album</label>
            <div class="control">
              <input class="input" type="text" v-model="album" placeholder="Nom de l'album" />
            </div>
          </div>
          <div class="field">
            <label class="label">Année</label>
            <div class="control">
              <input class="input" type="text" v-model="year" placeholder="Année de réalisation" />
            </div>
          </div>
          <div class="field">
            <label class="label">Style</label>
            <div class="control">
              <input class="input" type="text" v-model="style" placeholder="Genre de la musique" />
            </div>
          </div>
          <div class="control">
            <button @click="submitChange" class="button is-primary">Envoyer</button>
          </div>
        </div>

        <!-- //======= Liste de chansons de l'évènement =======// -->

        <div class="music">
          <div class="card music-selected">
            <header class="card-header">
              <p class="card-header-title">Chansons de l'évènement</p>
            </header>
            <div class="card-content">
              <ul>
                <li v-for="item in this.event_data.songs" v-bind:key="item._id">
                  {{ item.title }}
                  <a @click="deleteSong(item._id)">
                    <span class="icon has-text-danger">
                      <i class="fas fa-trash-alt"></i>
                    </span>
                  </a>
                  <hr />
                </li>
              </ul>
            </div>
          </div>

          <!-- //======= Catalogue de Chansons =======// -->

          <div class="card music-library">
            <header class="card-header">
              <p class="card-header-title">Catalogue</p>
            </header>
            <div class="card-content">
              <ul>
                <li v-for="item in this.songsList" :key="item._id">
                  {{ item.title }}
                  <a @click="addSong(item._id)">
                    <span class="icon has-text-success">
                      <i class="fas fa-plus"></i>
                    </span>
                  </a>
                  <hr />
                </li>
              </ul>
            </div>
          </div>
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
      songListTemp: [],
      file: {},
      songTags: null,
      isEmpty: false,
      songsList: [],
      isSending: 0,
      isMissing: 0,
      title: "",
      artist: "",
      album: "",
      year: "",
      style: "",
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
          if (
            !tag.tags.artist ||
            !tag.tags.title ||
            !tag.tags.album ||
            !tag.tags.year
          ) {
            console.log("Informations manquante");
            console.log(tag.tags.title);
            console.log(tag.tags.artist);
            console.log(tag.tags.album);
            console.log(tag.tags.year);
            this.isMissing = 1;
            this.title = tag.tags.title;
            this.artist = tag.tags.artist;
            this.album = tag.tags.album;
            this.year = tag.tags.year;
          } else {
            this.isMissing = 0;
            this.songTags.append("title", tag.tags.title);
            this.songTags.append("artist", tag.tags.artist);
            this.songTags.append("album", tag.tags.album);
            this.songTags.append("date", tag.tags.year);
          }
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

    submitChange() {
      this.songTags.append("title", this.title);
      this.songTags.append("artist", this.artist);
      this.songTags.append("album", this.album);
      this.songTags.append("date", this.year);
      this.songTags.append("style", this.style);
      this.isMissing = 0;
      this.submitFile();
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
            this.loadEvent();
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
        this.loadSongs();
      });
    },

    loadSongs() {
      axios
        .get("songs/")
        .then((response) => {
          this.songsList = response.data.songs;
          console.log(this.songsList);
          this.checkSongs();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    checkSongs() {
      console.log(this.event_data.songs.length);
      for (let i = 0, len = this.event_data.songs.length; i < len; i++) {
        for (let j = 0, len2 = this.songsList.length; j < len2; j++) {
          if (this.songsList[j]._id == this.event_data.songs[i]._id) {
            console.log("Trouver");
            console.log(this.songsList[i]._id);
            this.songsList.splice(j, 1);
            len2 = this.songsList.length;
          } else {
            console.log("pas trouver");
          }
        }
      }
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
          this.checkSongs();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getDate(e) {
      let d = new Date(e.slice(0, 10));
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      let dateFR = d.toLocaleDateString("fr-FR", options);
      this.dateFR = dateFR;
      return this.dateFR;
    },
  },

  watch: {
    $route(to, from) {},
  },

  mounted() {
    if (this.$route.params.id) {
      this.loadEvent();

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
@import "../assets/scss/style.scss";
.modal {
  z-index: 1000;
}

div.f-group {
  width: 480px;
  margin: auto;
  margin-bottom: 2em;
  margin-top: 1em;

  span.file-cta {
    background-color: $primary;
    color: $beige-lighter;
  }
}

div.music-library.card,
div.music-selected.card {
  height: 580px;
  overflow-y: scroll;
}

div.music {
  width: 1200px;
  margin: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

div.music-library {
  width: 500px;
  text-align: right;
}
div.music-selected {
  width: 500px;
  margin-right: 1em;
  text-align: left;
}

div.qrcode div.card {
  width: 400px;
  margin: auto;
  border-radius: 1em;
  margin-bottom: 2em;
}

div.event {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 1200px;
  div.desc {
    width: 500px;
    margin-right: 1em;
  }
  div.qrcode {
    width: 500px;
  }
}

hr {
  background-color: $grey-light;
}
</style>
