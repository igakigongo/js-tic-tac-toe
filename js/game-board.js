/**
 * Create a board as soon as the game is loaded or the DOM is ready
 */
const gameBoard = (function() {
	const gameBoardRef = this;

	const MIN_MOVES_FOR_WIN_EVALUATION = 5;
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
	 * Reset the board
	 */
	function reset() {
		slots.fill(null);
	}

	/**
	 * Get the total slots of the board
	 */
	function totalSlots() {
		return slots.length;
	}

	function totalSlotsFilled() {
		return slots.reduce(function(a, c) {
			a += c ? 1 : 0;
			return a;
		}, 0);
	}

	function symbolsUsed() {
		return slots.reduce(function(a, c) {
			if (c && !a.includes(c)) {
				a.push(c);
			}
			return a;
		}, []);
	}

	/**
	 * Evalute the winning symbol
	 */
	function winningSymbol() {
		const totalSlotsFilledIn = totalSlotsFilled();

		if (totalSlotsFilledIn < MIN_MOVES_FOR_WIN_EVALUATION) {
			return null;
		}

		const symbolsUsedInGame = symbolsUsed();
		for (const symbol of symbolsUsedInGame) {
			// check for the winner based on what they played
			const won = winningMoves.reduce(function(aState, cMove) {
				aState |= cMove.every(function(value) {
					return symbol === slots[value];
				});

				return aState;
			}, false);

			if (won) {
				return symbol;
			}
		}

		return null;
	}

	gameBoardRef.addEventListener(events.MOVE_PLAYED, function(movePlayedEvent) {
		const { symbol, value } = movePlayedEvent.detail;
		const index = +value;
		let event;

		if (!slots[index]) {
			slots[index] = symbol;
			event = new CustomEvent(events.SYMBOL_PLACED, { detail: movePlayedEvent.detail });
		} else {
			event = new CustomEvent(events.SYMBOL_PLACEMENT_REJECTED, {
				detail: {
					value
				}
			});
		}
		gameBoardRef.dispatchEvent(event);
	});

	return {
		freeSlots: function() {
			return totalSlots() - totalSlotsFilled();
		},
		reset,
		totalSlots,
		winningSymbol
	};
})();
