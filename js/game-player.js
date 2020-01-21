/**
 * Factory for creating players to use in the game
 * @param {String} name
 * @param {String} symbol
 */
const createPlayer = function(name, symbol) {
	if (!name) throw "Invalid player name";
	if (!symbol) throw "Invalid player symbol";

	/**
	 * Check for equality without using memory references
	 * @param {Player} other
	 */
	function equals(other) {
		if (!other) return false;
		const props = Object.getOwnPropertyNames(other);
		if (!props.includes("name") && !props.includes("symbol")) return false;
		return other["name"] === name && other["symbol"] === symbol;
	}

	function toString() {
		return `${name} using symbol: ${symbol}`;
	}

	return {
		*[Symbol.iterator]() {
			yield name;
			yield symbol;
		},
		equals,
		name,
		symbol,
		toString
	};
};
