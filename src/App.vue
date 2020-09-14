<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-start">
        <a @click="$router.go(-1)" class="navbar-item">
          <i class="fas fa-arrow-left" style="margin-right: 0.5em"></i>Retour
        </a>
      </div>
      <div class="navbar-end">
        <a
          v-if="this.$store.state.user"
          type="button"
          @click="logout()"
          class="navbar-item"
          href="#"
        >Déconnexion</a>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.commit("logout");
      this.$router.push("/");
    },
    onRouteChange() {
      if (this.$store.state.user == false) {
        this.$router.push("/");
      }
    },
  },

  watch: {
    $route(to, from) {
      this.onRouteChange();
    },
  },

  mounted() {
    if (this.$store.state.user == false) {
      this.$router.push("/");
    }
    let header = document.createElement("script");
    header.setAttribute(
      "src",
      "https://use.fontawesome.com/releases/v5.3.1/js/all.js"
    );
    document.head.appendChild(header);
  },
  computed: {
    tokenSet() {
      return this.$store.state.user_token !== ""
        ? this.$store.state.user_token
        : "";
    },
  },
};
</script>

<style lang="scss">
@import "./assets/css/loading.css";
@import "./assets/css/loading.min.css";

@import "assets/scss/style.scss";
@import "../node_modules/bulma/bulma.sass";

div#app {
  font-family: Lato, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #dfdde0;
  height: 100vh;
  min-height: 100%;
  position: relative;
  background-color: #36393f;
}

nav.navbar {
  border-bottom: 1px solid black;
}

label {
  color: #ffffff;
}

html,
body {
  margin: 0px;
  height: 100%;
  background-color: #36393f;
}
</style>
