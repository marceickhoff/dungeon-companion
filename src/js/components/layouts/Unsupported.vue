<template>
	<div class="unsupported">
		<div class="unsupported-icon"><fa icon="skull-crossbones"/></div>
		<p>Well, that was a waste of time.</p>
		<p>Sorry, but your browser does not support one or more crucial features required for Dungeon Companion to work, most likely because it is outdated.</p>
		<p>Please upgrade your Browser to a newer version or try a different Browser.</p>
	</div>
</template>

<script>
import ErrorMessage from "../base/ErrorMessage";

export default {
	components: {
		'error-message': ErrorMessage
	}
}
</script>