/**
 * Create a board as soon as the game is loaded or the DOM is ready
 */
const gameBoard = (function() {
	const slots = new Array(9);
	const winningMoves = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];

	/**
	 * Place a symbol onto the board
	 * @param {String} symbol
	 */
	function placeSymbol(symbol) {
		console.log(symbol);
	}

	/**
	 * Reset the board
	 */
	function reset() {}

	function size() {
		return slots.length;
	}

	return {
		placeSymbol,
		reset,
		size
	};
})();
