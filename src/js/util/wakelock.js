import NoSleep from 'nosleep.js';

export default {

	/**
	 * Enables wake lock to that the screen stays active.
	 * The support for this is rather wonky, so bear with me here.
	 */
	enable() {
		// Via Wake Lock API
		let wakeLock = null;
		const requestWakeLock = async () => {
			if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request();
		};
		document.addEventListener('visibilitychange', async () => {
			if (wakeLock !== null && document.visibilityState === 'visible') requestWakeLock().then().catch();
		});
		requestWakeLock().then().catch();

		// Via nosleep.js (uses looped background video)
		let noSleep = new NoSleep();
		let events = ['click', 'mousedown'];
		events.forEach(event => {
			document.addEventListener(event, function enableNoSleep() {
				events.forEach(event => document.removeEventListener(event, enableNoSleep, false));
				if (!noSleep.isEnabled) {
					noSleep.enable().then();
				}
			}, false);
		})
	}
};