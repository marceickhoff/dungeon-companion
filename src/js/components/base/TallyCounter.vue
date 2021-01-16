<template>
	<div class="tally-counter">
		<button class="button tally-counter-increase" v-if="controls" @click="$emit('increase')" :disabled="max && value >= max"><fa icon="chevron-up"/></button>
		<span class="tally-counter-label" v-if="label">{{ label }}</span>
		<span class="tally-counter-value">{{ value }}</span>
		<button class="button tally-counter-decrease" v-if="controls" @click="$emit('decrease')" :disabled="min && value <= min"><fa icon="chevron-down"/></button>
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