<template>
	<div>
		<div v-for="item in this.event_data">{{item}}</div>
		<hr>
	</div>
</template>

<script>
	export default{
		name: 'OrganizerEvent',
		methods :{
			loadEvent(){
				axios.get('parties/event/'+this.$route.params.id).then(response => {
					this.event_data = response.data;
					console.log(this.event_data)
				})
			}
		}, 
		data(){
			return {
				event_data : {},
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
