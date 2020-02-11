/* exported gameBoard */
/* global events */
/* eslint func-names: ["error", "never"] */

/**
 * Create a board as soon as the game is loaded or the DOM is ready
 */
/* eslint-disable-next-line no-unused-vars */
const gameBoard = (function () {
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
    [2, 4, 6],
  ];

  /**
  * Get the total slots of the board
  */
  function totalSlots() {
    return slots.length;
  }

  function totalSlotsFilled() {
    return slots.reduce((a, c) => {
      a += c ? 1 : 0;
      return a;
    }, 0);
  }

  function symbolsUsed() {
    return slots.reduce((a, c) => {
      if (c && !a.includes(c)) {
        a.push(c);
      }
      return a;
    }, []);
  }

  /**
  * Evaluate the winning symbol
  */
  function winningSymbol() {
    const totalSlotsFilledIn = totalSlotsFilled();

    if (totalSlotsFilledIn < MIN_MOVES_FOR_WIN_EVALUATION) {
      return null;
    }

    const symbolsUsedInGame = symbolsUsed();
    for (let i = 0; i < symbolsUsedInGame.length;) {
      // check for the winner based on what they played
      const symbol = symbolsUsedInGame[i];
      const won = winningMoves.reduce((aState, cMove) => {
        // eslint-disable-next-line no-bitwise
        aState |= cMove.every((value) => symbol === slots[value]);

        return aState;
      }, false);

      if (won) {
        return symbol;
      }
      i += 1;
    }

    return null;
  }

  gameBoardRef.addEventListener(events.MOVE_PLAYED, (movePlayedEvent) => {
    const { symbol, value } = movePlayedEvent.detail;
    const index = +value;
    let event;

    if (!slots[index]) {
      slots[index] = symbol;
      event = new CustomEvent(events.SYMBOL_PLACED, { detail: movePlayedEvent.detail });
    } else {
      event = new CustomEvent(events.SYMBOL_PLACEMENT_REJECTED, {
        detail: {
          value,
        },
      });
    }
    gameBoardRef.dispatchEvent(event);
  });

  gameBoardRef.addEventListener(events.NEW_GAME_INITIATED, () => {
    slots.fill(null);
  });

  gameBoardRef.addEventListener(events.RESTART_CURRENT_GAME, () => {
    slots.fill(null);
  });

  return {
    freeSlots() {
      return totalSlots() - totalSlotsFilled();
    },
    totalSlots,
    winningSymbol,
  };
}());
