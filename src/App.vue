<template>
  <div id="app">
    <div id="nav">
      <a v-if="this.$store.state.user" type="button" @click="logout()" class="router-link-active" href="#">Déconnexion</a>
    </div>
    <router-view/>
  </div>
</template>


<script>
  export default {
    methods :{
      logout(){
        this.$store.commit('logout')
        this.$router.push('/')
      },
      onRouteChange(){
          if(this.$store.state.user == false){
            this.$router.push('/')
          }
        }
      },

    watch:{
        $route (to, from){
          this.onRouteChange();
        }
    }, 

    mounted(){
      if(this.$store.state.user == false){
          this.$router.push('/')
        }
      let header = document.createElement('script')
        header.setAttribute('src', 'https://use.fontawesome.com/releases/v5.3.1/js/all.js')
        document.head.appendChild(header)
    },
    computed : {
      tokenSet(){
        return (this.$store.state.user_token !== '') ? this.$store.state.user_token : ""
      }
    },
  }
</script>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
