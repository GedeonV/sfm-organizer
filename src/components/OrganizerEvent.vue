<template>
	<div>
		<h1 class="title">{{event_data.event_name}}</h1>
		<p>Description : {{event_data.description}}</p>
		<p>Date : {{event_data.date}}</p>
		<p>Theme : {{event_data.theme}}</p>
		<p>Code : {{event_data.event_code}}
		<hr>
		<h2 class="title">Inscriptions</h2>
		<div v-for="item in this.event_data.users">{{item}}</div>
		<hr>
		<h2 class="title">Chansons</h2>
		<input type="file" @change="loadFile" name="file">
	</div>
</template>

<script>
	export default{
		name: 'OrganizerEvent',
		methods :{
			loadFile(af){
				const file = af.target.files[0];
      			const reader = new FileReader()
      			console.log(file)
      			reader.onload = e => this.$emit("load", e.target.result);
			},
			loadEvent(){
				axios.get('parties/event/'+this.$route.params.id).then(response => {
					this.event_data = response.data;
					console.log(this.event_data)
				})
			}
		}, 
		data(){
			return {
				event_data: {},
			}
		},
		watch:{
		    $route (to, from){
		    
		    }
		}, 		
		mounted(){
			if(this.$route.params.id){
				this.loadEvent()
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
	.modal{
		z-index: 1000;
	}
</style>
