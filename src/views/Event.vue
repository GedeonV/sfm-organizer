<template>
	<div class="container">
    	<OrganizerEvent/>
	</div>
</template>


<script>
// @ is an alias to /src
	import OrganizerEvent from '@/components/OrganizerEvent'

	export default {
	  name: 'Event',
	  components: {
	    OrganizerEvent
	  },
	}
</script>