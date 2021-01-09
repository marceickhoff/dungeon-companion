<template>
	<div :class="['modal', (active ? 'modal-active' : '')]">
		<div class="modal-container">
			<slot/>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		active: {
			type: Boolean,
			required: true
		}
	}
}
</script>