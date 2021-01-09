<template>
	<div class="tally-counter">
		<button v-if="controls" @click="$emit('increase')" :disabled="max && value >= max"><fa icon="chevron-up"/></button>
		<span v-if="label">{{ label }}</span>
		<span>{{ value }}</span>
		<button v-if="controls" @click="$emit('decrease')" :disabled="min && value <= min"><fa icon="chevron-down"/></button>
	</div>
</template>
<script>
export default {
	props: {
		label: {
			type: String,
			required: false
		},
		value: {
			type: Number,
			required: true
		},
		min: {
			type: Number,
			required: false
		},
		max: {
			type:  Number,
			required: false
		},
		controls: {
			type: Boolean,
			required: false,
			default: true
		}
	}
}
</script>