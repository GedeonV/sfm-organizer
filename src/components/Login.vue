<template>
  <div class="container">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">Connexion</p>
      </header>
      <div class="card-content">
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input
              v-model="email"
              v-bind:class="{
                'is-danger': missingEmail,
                'is-rounded': enable,
                input: enable,
              }"
              type="text"
              name="email"
              placeholder="Email"
            />
            <p v-show="missingEmail" class="help is-danger">
              Le champ doit être rempli
            </p>
          </div>
        </div>

        <div class="field">
          <label class="label">Mot de passe</label>
          <div class="control">
            <input
              v-model="password"
              v-bind:class="{
                'is-danger': missingPassword,
                'is-rounded': enable,
                input: enable,
              }"
              type="password"
              name="psswd"
              placeholder="Mot de passe"
            />
            <p v-if="missingPassword" class="help is-danger">
              Le champ doit être rempli
            </p>
            <p v-if="wrongPassword" class="help is-danger">
              Mauvais mot de passe
            </p>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <button @click="signin()" class="button is-link">
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "gedeonv88@gmail.com",
      missingEmail: false,
      password: "1234",
      missingPassword: false,
      wrongPassword: false,
      enable: true,
    };
  },
  methods: {
    signin() {
      if (this.email.length > 0) {
        if (this.password.length > 0) {
          let log = {};
          log.email = this.email;
          log.password = this.password;
          console.log(log);
          axios
            .post("users/login", log)
            .then((response) => {
              console.log(response.data);
              if (response.data.error) {
                this.wrongPassword = true;
                this.missingPassword = false;
              } else if (response.data.rank == 1) {
                this.$store.commit("user", response.data);
                this.$router.push("admin");
              } else {
                console.log("Vous n'êtes pas admin accès impossible");
              }
            })
            .catch((err) => {
              console.log(err);
              this.wrongPassword = true;
            });
        } else {
          this.missingPassword = true;
        }
      } else {
        this.missingEmail = true;
      }
    },
  },
  mounted() {
    if (this.$store.state.user) {
      this.$router.push("/admin");
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../assets/scss/style.scss";

div.container {
  margin-top: 30vh; /* poussé de la moitié de hauteur de viewport */
  transform: translateY(-30%); /* tiré de la moitié de sa propre hauteur */
}

div.card {
  width: 550px;
  height: 350px;
  margin: auto;
  border-radius: 1em;
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

header p.card-header-title {
  font-size: 16pt;
}
</style>
