<template>
  <div>
    <ul>
      <li v-for="item in this.events" :key="item._id">
        <router-link :to="{ name: 'event', params: { id: item._id } }">
          {{ item }}
        </router-link>
        <a @click="deleteEvent(item._id)">
          <span class="icon has-text-danger">
            <i class="fas fa-trash-alt"></i>
          </span>
        </a>
        <a
          @click="
            showModalEvent(
              item._id,
              item.event_name,
              item.date,
              item.location,
              item.description,
              item.event_code,
              item.theme
            )
          "
        >
          <span class="icon has-text-success">
            <i class="fas fa-edit"></i>
          </span>
        </a>
      </li>
    </ul>
    <hr />
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

    <l-map
      @click="addMarker"
      style="height: 300px; width: 300px"
      :zoom="zoom"
      :center="center"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker
        v-for="(marker, index) in markers"
        :lat-lng="marker"
        :key="index"
      ></l-marker>
    </l-map>

    <div class="field">
      <label class="label">Description</label>
      <div class="control">
        <textarea
          class="textarea"
          v-model="description"
          placeholder="Primary textarea"
        ></textarea>
      </div>
    </div>

    <div class="field">
      <label class="label">Code d'accès</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="event_code"
          placeholder="Code pour accéder à la soirée"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Thème</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="theme"
          placeholder="Thème de la soirée"
        />
      </div>
    </div>

    <div class="field">
      <div class="control">
        <button @click="submitForm()" class="button is-link">Submit</button>
      </div>
    </div>

    <hr />
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
        <a @click="submitFile()" class="button is-info">Envoyer</a>
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

    <ul>
      <li v-for="item in this.songsList" :key="item._id">
        {{ item }}
        <a @click="deleteSong(item._id)">
          <span class="icon has-text-danger">
            <i class="fas fa-trash-alt"></i>
          </span>
        </a>
      </li>
    </ul>

    <hr />

    <label class="label">Liste d'utilisateur</label>
    <ul>
      <li v-for="item in this.users" :key="item._id">
        {{ item }}
        <a v-if="item.rank !== 1" @click="toggleUserRank(item._id, false)">
          <span class="icon ml-6 has-text-success">
            Promouvoir
            <i class="fas ml-1 fa-angle-double-up"></i>
          </span>
        </a>
        <a v-else @click="toggleUserRank(item._id, true)">
          <span class="icon ml-6 has-text-danger">
            Rétrograder
            <i class="fas ml-1 fa-angle-double-down"></i>
          </span>
        </a>
      </li>
    </ul>

    <div class="modal" v-bind:class="{ 'is-active': isActiveEvent }">
      <div class="modal-background"></div>
      <div class="modal-content">
        <h1 class="title has-text-white">Changements :</h1>

        <div class="field">
          <label class="label">Nom</label>
          <div class="control">
            <input
              class="input"
              type="text"
              v-model="tempName"
              placeholder="Nom de l'événement"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Date</label>
          <div class="control">
            <input class="input" v-model="tempDate" type="date" />
          </div>
        </div>

        <l-map
          @click="addMarker_2"
          style="height: 300px; width: 300px"
          :zoom="zoom_2"
          :center="center_2"
          @update:zoom="zoomUpdated_2"
          @update:center="centerUpdated_2"
          @update:bounds="boundsUpdated_2"
        >
          <l-tile-layer :url="url_2"></l-tile-layer>
          <l-marker
            v-for="(marker, index) in markers_2"
            :lat-lng="marker"
            :key="index"
          ></l-marker>
        </l-map>

        <div class="field">
          <label class="label">Description</label>
          <div class="control">
            <textarea
              class="textarea"
              v-model="tempDesc"
              placeholder="Primary textarea"
            ></textarea>
          </div>
        </div>

        <div class="field">
          <label class="label">Code d'accès</label>
          <div class="control">
            <input
              class="input"
              type="text"
              v-model="tempCode"
              placeholder="Code pour accéder à la soirée"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Thème</label>
          <div class="control">
            <input
              class="input"
              type="text"
              v-model="tempTheme"
              placeholder="Thème de la soirée"
            />
          </div>
        </div>

        <div class="field">
          <div class="control">
            <button @click="changeEvent(event_id)" class="button is-link">
              Submit
            </button>
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        @click="closeModal()"
        aria-label="close"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrganizerTools",

  data() {
    return {
      events: null,
      event_name: "",
      event_code: "",
      event_id: "",
      theme: "",
      date: null,
      location: {},
      description: "",
      isActiveEvent: false,
      //===================//
      tempName: "",
      tempDate: "",
      tempDesc: "",
      tempCode: "",
      tempTheme: "",
      //===================//
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      zoom: 7,
      center: [0, 0],
      bounds: null,
      markers: [],
      map: null,
      //===================//
      url_2: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      zoom_2: 7,
      center_2: [0, 0],
      bounds_2: null,
      markers_2: [],
      //==================//
      file: {},
      songTags: null,
      isEmpty: false,
      songsList: null,
      isSending: 0,
      //=================//
      users: [],
    };
  },

  methods: {
    loadPosition() {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        this.center = [lat, long];
        this.center_2 = [lat, long];
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
            this.loadSongs();
          }
        })
        .catch((err) => {
          console.log(err);
          this.isSending = 3;
        });
    },

    addMarker(event) {
      console.log(event.latlng);
      if (this.markers.length < 1) {
        this.markers.push(event.latlng);
      } else if (this.markers.length != 2) {
        this.markers.pop();
        this.markers.push(event.latlng);
      }
    },

    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
      this.center = center;
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
    },

    addMarker_2(event) {
      console.log(event.latlng);
      if (this.markers_2.length < 1) {
        this.markers_2.push(event.latlng);
      } else if (this.markers_2.length != 2) {
        this.markers_2.pop();
        this.markers_2.push(event.latlng);
      }
    },

    zoomUpdated_2(zoom) {
      this.zoom_2 = zoom;
    },
    centerUpdated_2(center) {
      this.center_2 = center;
    },
    boundsUpdated_2(bounds) {
      this.bounds_2 = bounds;
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
      eventData.location = this.markers;
      eventData.description = this.description;
      eventData.state = 0;
      eventData.event_code = this.event_code;
      eventData.theme = this.theme;

      axios
        .post("parties/create", eventData)
        .then((response) => {
          console.log(response.data);
          this.loadEvents();
        })
        .catch((err) => {
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
      UpdatedData.location = this.markers_2;
      UpdatedData.description = this.tempDesc;
      UpdatedData.state = 0;
      UpdatedData.event_code = this.tempCode;
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

    showModalEvent(id, name, date, location, description, code, theme) {
      setTimeout(function() {
        window.dispatchEvent(new Event("resize"));
      }, 250); // Aide à charger correctement la map (hack)
      this.isActiveEvent = true;
      this.event_id = id;
      this.tempName = name;
      this.tempDate = date.slice(0, 10);
      this.markers_2 = location;
      console.log(location);
      this.tempDesc = description;
      this.tempCode = code;
      this.tempTheme = theme;
    },
    closeModal() {
      this.isActiveEvent = false;
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
  },

  watch: {
    $route(to, from) {},
  },

  mounted() {
    this.loadEvents();
    this.loadPosition();
    this.loadSongs();
    this.loadUsers();
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.modal {
  z-index: 1000;
}
</style>
