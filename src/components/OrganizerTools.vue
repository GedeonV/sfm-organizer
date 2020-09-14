<template>
  <div class="columns">
    <aside class="column is-one-fifth menu">
      <p class="menu-label">Evènements</p>
      <ul class="menu-list">
        <li>
          <a @click="changeTo(1)" :class="{'is-active': isEventActive}">Liste d'évènements</a>
        </li>
        <li>
          <a @click="changeTo(2)" :class="{'is-active': isCreateActive}">Créer un Evènement</a>
        </li>
      </ul>
      <p class="menu-label">Chansons</p>
      <ul class="menu-list">
        <li>
          <a @click="changeTo(3)" :class="{'is-active': isMusicActive}">Catalogue</a>
        </li>
      </ul>
      <p class="menu-label">Utilisateurs</p>
      <ul class="menu-list">
        <li>
          <a @click="changeTo(4)" :class="{'is-active': isUserActive}">Liste d'utilisateurs</a>
        </li>
      </ul>
    </aside>
    <div class="column">
      <!-- //======= Liste des Evènements =======// -->
      <div class="events" v-if="isEventActive">
        <ul>
          <li v-for="item in computedDate" :key="item._id">
            <div class="card grow">
              <header class="card-header">
                <p class="card-header-title">{{ item.event_name }}</p>
              </header>

              <div class="card-content">
                <p>{{ item.theme }}</p>
                <p>{{ item.date }}</p>
                <p id="desc">{{ item.description }}</p>
                <p>{{ item.location }}</p>
                <p id="ptag">
                  Nombre d'inscrit:
                  <span class="tag is-info">{{ item.users.length }}</span>
                </p>
                <p v-if="item.state === 1">
                  <span class="tag is-success">Evènement commencé</span>
                </p>
                <p v-if="item.state === 0">
                  <span class="tag is-link">Evènement non commencé</span>
                </p>
                <p v-if="item.state === 2">
                  <span class="tag is-danger">Evènement terminé</span>
                </p>
              </div>
              <footer class="card-footer">
                <router-link
                  class="card-footer-item"
                  :to="{ name: 'event', params: { id: item._id } }"
                >Accéder</router-link>
                <a
                  class="card-footer-item"
                  @click="showModalEvent(item._id,item.event_name,item.date,item.location,item.description,item.theme)"
                >Modifier</a>
                <a @click="deleteEvent(item._id)" class="card-footer-item">Supprimer</a>
              </footer>
            </div>
          </li>
        </ul>
      </div>

      <!-- //======= Formulaire de création d'évènement =======// -->
      <div v-else-if="isCreateActive">
        <div class="card eventform">
          <header class="card-header">
            <p class="card-header-title">Création d'évènement</p>
          </header>
          <div class="card-content">
            <div class="field">
              <label class="label">Nom</label>
              <div class="control">
                <input
                  class="input"
                  v-model="event_name"
                  type="text"
                  placeholder="Nom de l'événement"
                />
              </div>
            </div>

            <div class="field">
              <label class="label">Date</label>
              <div class="control">
                <input class="input" v-model="date" type="date" />
              </div>
            </div>

            <div class="field">
              <label class="label">Lieux</label>
              <div class="control">
                <input class="input" v-model="location" type="text" />
              </div>
            </div>

            <div class="field">
              <label class="label">Description</label>
              <div class="control">
                <textarea
                  class="textarea"
                  v-model="description"
                  placeholder="Description de l'évènement"
                ></textarea>
              </div>
            </div>

            <div class="field">
              <label class="label">Thème</label>
              <div class="control">
                <input class="input" type="text" v-model="theme" placeholder="Thème de la soirée" />
              </div>
            </div>

            <div class="field">
              <div class="control">
                <button @click="submitForm()" class="button is-link">Envoyer</button>
              </div>
            </div>
          </div>
          <div v-if="success" class="notification is-primary">{{event_nameTemp}} créer avec succès</div>
          <div
            v-if="fail"
            class="notification is-danger"
          >Erreur lors de la création (Nom déjà pris / Informations manquantes)</div>
        </div>
      </div>
      <!-- //======= Formulaire d'ajout de musique =======// -->
      <div v-else-if="isMusicActive">
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
            <a class="button is-primary">
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

        <div class="missingData" v-if="isMissing">
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

        <!-- //======= Liste des Chansons du catalogue =======// -->

        <table class="table is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>#</th>
              <th>Titre</th>
              <th>Artiste</th>
              <th>Album</th>
              <th>Date</th>
              <th>Style</th>
              <th>Supprimer</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th>#</th>
              <th>Titre</th>
              <th>Artiste</th>
              <th>Album</th>
              <th>Date</th>
              <th>Style</th>
              <th>Supprimer</th>
            </tr>
          </tfoot>
          <tbody>
            <tr v-for="(item, index) in this.songsList" :key="item._id">
              <td>{{index + 1}}</td>
              <td>{{item.title}}</td>
              <td>{{item.artist}}</td>
              <td>{{item.album}}</td>
              <td>{{item.date}}</td>
              <td>{{item.style}}</td>
              <td>
                <a @click="deleteSong(item._id)">
                  <span class="icon has-text-danger">
                    <i class="fas fa-times"></i>
                  </span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- //======= Liste d'utilisateurs =======// -->

      <div class="user-class" v-else-if="isUserActive">
        <label class="label">Liste d'utilisateurs</label>
        <ul>
          <li v-for="item in this.users" :key="item._id">
            <div class="card user-card">
              <div class="card-content">
                <p>{{ item.first_name}} {{item.last_name}}</p>
                <p>{{item.email}}</p>
                <p>{{item.mobile}}</p>
                <footer class="card-footer">
                  <a
                    class="card-footer-item"
                    v-if="item.rank !== 1"
                    @click="toggleUserRank(item._id, false)"
                  >
                    <span class="icon has-text-success">
                      Promouvoir
                      <i class="fas ml-1 fa-angle-double-up"></i>
                    </span>
                  </a>
                  <a class="card-footer-item" v-else @click="toggleUserRank(item._id, true)">
                    <span class="icon has-text-danger">
                      Rétrograder
                      <i class="fas ml-1 fa-angle-double-down"></i>
                    </span>
                  </a>
                </footer>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- //======= Modal modif évènements =======// -->

      <div class="modal" v-bind:class="{ 'is-active': isUpdateEvent }">
        <div class="modal-background"></div>
        <div class="modal-content">
          <h1 class="title has-text-white">Changements :</h1>

          <div class="field">
            <label class="label">Nom</label>
            <div class="control">
              <input class="input" type="text" v-model="tempName" placeholder="Nom de l'événement" />
            </div>
          </div>

          <div class="field">
            <label class="label">Date</label>
            <div class="control">
              <input class="input" v-model="tempDate" type="date" />
            </div>
          </div>

          <div class="field">
            <label class="label">Lieux</label>
            <div class="control">
              <input class="input" v-model="tempLocation" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <textarea class="textarea" v-model="tempDesc" placeholder="Primary textarea"></textarea>
            </div>
          </div>

          <div class="field">
            <label class="label">Thème</label>
            <div class="control">
              <input class="input" type="text" v-model="tempTheme" placeholder="Thème de la soirée" />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button @click="changeEvent(event_id)" class="button is-link">Submit</button>
            </div>
          </div>
        </div>
        <button class="modal-close is-large" @click="closeModal()" aria-label="close"></button>
      </div>
      <div class="hack"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrganizerTools",

  data() {
    return {
      //=========Variables Evènements==========//
      events: [],
      event_name: "",
      event_nameTemp: "",
      event_id: "",
      theme: "",
      date: null,
      location: "",
      description: "",
      isUpdateEvent: false,
      //=========Variables Formulaire Modal==========//
      tempName: "",
      tempDate: "",
      tempDesc: "",
      tempTheme: "",
      tempLocation: "",
      //=========Variables Chansons==========//
      file: {},
      songTags: null,
      isEmpty: false,
      songsList: null,
      isSending: 0,
      isMissing: 0,
      title: "",
      artist: "",
      album: "",
      year: "",
      style: "",
      //=========Variables liste Utilisateurs==========//
      users: [],
      //=========Variables d'Etat=========//
      isEventActive: true,
      isCreateActive: false,
      isMusicActive: false,
      isUserActive: false,
      success: false,
      fail: false,
    };
  },

  methods: {
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
            this.loadSongs();
          }
        })
        .catch((err) => {
          console.log(err);
          this.isSending = 3;
        });
    },

    deleteSong(id) {
      axios
        .delete("songs/" + id)
        .then((response) => {
          console.log(response.data);
          this.loadSongs();
        })
        .catch((err) => {
          console.log(err);
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

    submitForm() {
      let eventData = {};
      eventData.event_name = this.event_name;
      eventData.date = this.date;
      eventData.location = this.location;
      eventData.description = this.description;
      eventData.state = 0;
      eventData.theme = this.theme;

      axios
        .post("parties/create", eventData)
        .then((response) => {
          console.log(response.data);
          this.loadEvents();
          this.event_nameTemp = this.event_name;
          this.event_name = "";
          this.date = "";
          this.location = "";
          this.description = "";
          this.theme = "";
          this.success = true;
          let interval = setInterval(() => {
            this.success = false;
            clearInterval(interval);
          }, 5000);
        })
        .catch((err) => {
          this.fail = true;
          let interval = setInterval(() => {
            this.fail = false;
            clearInterval(interval);
          }, 5000);
          console.log(err);
        });
    },

    deleteEvent(id) {
      axios
        .delete("parties/" + id)
        .then((response) => {
          console.log(response.data);
          this.loadEvents();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    changeEvent(id) {
      console.log(id);
      let UpdatedData = {};
      UpdatedData.event_name = this.tempName;
      UpdatedData.date = this.tempDate;
      UpdatedData.location = this.tempLocation;
      UpdatedData.description = this.tempDesc;
      UpdatedData.state = 0;
      UpdatedData.theme = this.tempTheme;
      console.log(UpdatedData);
      axios.put("parties/event/" + id, UpdatedData).then((response) => {
        console.log(response.data);
        this.loadEvents();
      });
      this.closeModal();
    },

    loadEvents() {
      axios
        .get("parties/")
        .then((response) => {
          this.events = response.data.events;
          console.log(this.events);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    showModalEvent(id, name, date, location, description, theme) {
      this.isUpdateEvent = true;
      this.event_id = id;
      this.tempName = name;
      this.tempDate = date.slice(0, 10);
      this.tempLocation = location;
      this.tempDesc = description;
      this.tempTheme = theme;
    },
    closeModal() {
      this.isUpdateEvent = false;
    },

    toggleUserRank(id, rk) {
      let rank = null;
      rk ? (rank = 0) : (rank = 1);
      axios
        .put("users/user/" + id + "/rank", { rank: rank })
        .then((response) => {
          console.log(response.data);
          this.loadUsers();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    loadUsers() {
      axios
        .get("users/")
        .then((response) => {
          console.log(response.data.users);
          this.users = response.data.users;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    changeTo(e) {
      if (e === 1) {
        this.isEventActive = true;
        this.isCreateActive = false;
        this.isMusicActive = false;
        this.isUserActive = false;
        this.$store.commit("menu", 1);
      } else if (e === 2) {
        this.isEventActive = false;
        this.isCreateActive = true;
        this.isMusicActive = false;
        this.isUserActive = false;
        this.$store.commit("menu", 2);
      } else if (e === 3) {
        this.isEventActive = false;
        this.isCreateActive = false;
        this.isMusicActive = true;
        this.isUserActive = false;
        this.$store.commit("menu", 3);
      } else {
        this.isEventActive = false;
        this.isCreateActive = false;
        this.isMusicActive = false;
        this.isUserActive = true;
        this.$store.commit("menu", 4);
      }
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

  computed: {
    computedDate() {
      let prevDate = "";
      let newResult = [];
      this.events.forEach((events) => {
        let showDate = false;
        if (prevDate != events.date) {
          showDate = true;
          events.date = this.getDate(events.date);
        }
        newResult.push({
          ...events,
          showDate,
        });
        prevDate = events.date;
      });
      return newResult;
    },
  },

  mounted() {
    this.loadEvents();
    this.loadSongs();
    this.loadUsers();

    this.changeTo(this.$store.state.menu);

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
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/style.scss";

div.events {
  ul {
    display: flex;
    flex-direction: columns;
    flex-wrap: wrap;
    margin: 0 4em;
  }

  li {
    flex: 1 1 auto;
    margin-left: 10px;
  }

  p#desc {
    overflow-y: hidden;
    height: 75px;
  }
  p#ptag {
    margin: 5px;
  }
}

div.card.eventform {
  width: 800px;
  height: 700px;
  margin: auto;
  border-radius: 1em;

  &:hover {
    background-color: $grey-dark;
  }

  div.card-content {
    margin: 0;
    position: absolute;
    width: 80%;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
}

div.card {
  border-radius: 1em;
  width: 400px;
  margin: auto;
  margin-top: 1.5em;
  margin-bottom: 0.75em;

  footer.card-footer {
    border-bottom-left-radius: 1em;
    border-bottom-right-radius: 1em;
    a.card-footer-item {
      transition: 0.2s;
      color: $beige-lighter;
      &:hover {
        color: $primary;
        background-color: $grey-dark;
      }
    }
  }
}

div.card:hover {
  background-color: $grey-lighter;
  &.grow {
    transition: all 0.3s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }
  }
}

div.card-content {
  margin: 0;
}

header p.card-header-title {
  font-size: 16pt;
}

aside {
  background-color: $grey-dark;

  & > p.menu-label {
    margin-top: 1em;
  }
}

div.column {
  div.hack {
    height: 60vh;
  }

  & > div {
    margin-top: 2em;
  }

  & div.modal {
    z-index: 1000;
    margin-top: 0em;
  }
}

div.missingData {
  width: 80%;
  margin: auto;
  margin-bottom: 2em;
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

div.user-class {
  ul {
    display: flex;
    flex-direction: columns;
    flex-wrap: wrap;
    margin: 0 4em;
  }

  li {
    flex: 1 1 auto;
    margin-left: 5px;
  }
  div.card.user-card {
    text-align: right;

    footer.card-footer {
      margin-top: 1em;
      border-bottom-left-radius: 0em;
      border-bottom-right-radius: 0em;
      background-color: $grey-light;
    }
  }
}
</style>
