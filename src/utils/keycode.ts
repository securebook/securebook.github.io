export function isMac() {
	return typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false;
}

export const keycodes = {
	'enter': 13,
	'arrowleft': 37,
	'arrowright': 39,
	'arrowup': 38,
	'arrowdown': 40,
	's': 83,
};

export function isCtrl(e: KeyboardEvent) {
	return isMac() && e.metaKey || e.ctrlKey;
}