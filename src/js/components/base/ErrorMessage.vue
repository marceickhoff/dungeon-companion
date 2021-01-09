<template>
	<div class="error">
		<p><fa icon="exclamation-triangle"/> {{ message }}</p>
	</div>
</template>

<script>
export default {
	props: {
		message: {
			type: String,
			required: true
		}
	}
}
</script>