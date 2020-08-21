<template>
	<div></div>
</template>

<script>
	export default{
		name: 'OrganizerTools',
		methods :{
			loadEvents(){
				axios.get('parties/').then(response => {
					this.events = response.data;
					console.log(this.events)
				})
			}
		}, 
		data(){
			return {
				events : null
			}
		},
		watch:{
		    $route (to, from){
		    
		    }
		}, 		
		mounted(){
			this.loadEvents();
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
	
</style>
