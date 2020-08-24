<template>
	<div class="container">
		<div class="field">
			<label class="label">Email</label>
			<div class="control">
				<input v-model="email" v-bind:class="{'is-danger' : missingEmail, 'is-rounded' : enable, 'input' : enable}" type="text" name="email" placeholder="Email">
				<p v-show="missingEmail" class="help is-danger">Le champ doit être rempli</p>
			</div>
		</div>

		<div class="field">
			<label class="label">Mot de passe</label>
			<div class="control">
				<input v-model="password" v-bind:class="{'is-danger' : missingPassword, 'is-rounded' : enable, 'input' : enable}" type="password" name="psswd" placeholder="Mot de passe">
				<p v-if="missingPassword" class="help is-danger">Le champ doit être rempli</p>
				<p v-if="wrongPassword" class="help is-danger">Mauvais mot de passe</p>
			</div>
		</div>
			
		<div class="field">
			<div class="control">
				<button @click="signin()" class="button is-link">Envoyer</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name : 'Login',
		data(){
			return {
				email : "gedeonv88@gmail.com",
				missingEmail : false,
				password : "1234",
				missingPassword : false,
				wrongPassword : false,
				enable: true,
			}
		},
		methods :{
			signin(){
				if(this.email.length > 0){
					if (this.password.length > 0) {
						let log = {}
						log.email = this.email
						log.password = this.password
						console.log(log)
						axios.post('users/login',log).then(response => {
							console.log(response.data)
							if (response.data.error) {
								this.wrongPassword = true
								this.missingPassword = false
							} else if(response.data.rank == 1){
								this.$store.commit('user',response.data)
								this.$router.push("admin")
							} else {
								console.log("Vous n'êtes pas admin accès impossible")
							}
						});
					} else {
						this.missingPassword = true;
					}
				} else {
					this.missingEmail = true;
				}
			}
		},
	}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
