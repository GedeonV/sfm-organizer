<template>
	<div class="container">
    	<OrganizerTools/>
	</div>
</template>


<script>
// @ is an alias to /src
	import OrganizerTools from '@/components/OrganizerTools'

	export default {
	  name: 'Panel',
	  components: {
	    OrganizerTools
	  },
	}
</script>