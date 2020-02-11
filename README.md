# TicTacToe
An implementation of the Tic Tac Toe game using JavaScript - Exploring Modules (IIFE) and Factory Functions

## Tasks (Description of expectations)

- The project has been set up with HTML, CSS and Javascript files as shown below.

```
  src 
    |-- index.html
    |-- css (directory with all the css files)
    |-- js  (directory with all the javascript files)
```

- The game board is stored as an array inside of a GameBoard object.

```js
  const slots = new Array(9);
```

- The players are also stored as instances of objects created using the `createPlayer` factory function.

```js
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
    
    function toString(){
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
```

- The `UI Controller` object is used to control the flow of the game itself. It's design is based off an Immediately Invoked Function Expression, ensuring a single instance with encapsulation of most of the DOM Manipulation Logic

- The `UI Controller` constantly checks if a game is won, most of the work involved in doing this is delegated to the ```Game Board``` which can compute the winning symbol. Check the sample win function listed below

```js
/**
 * Evaluate the winning symbol
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
```
## Communication Style Between Modules
Although it's true that Immediately Invoked Function Expressions can be invoked from anywhere since I added them to the global scope. I have ensured that I have minimized this kind of communication and instead favoured use of `Events`. Generally speaking I can say the style of Event Driven Programming used here is very similar to `Event Carried State Transfer`. Please refer to the listing below

```js
  cell.addEventListener("click", function(evt) {
    const { symbol } = currentPlayer;
    const { value } = evt.target.dataset;
    const event = new CustomEvent(events.MOVE_PLAYED, { detail: { symbol, value } });
    controllerRef.dispatchEvent(event);
  });
```

Instead of calling a module's reference from the global scope, I have simply dispatched an event any properly set up Event Handler can handle. Below is the example of a listener or `EventHandler` that was used to handle this `Event`.

```js
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
```

NOTE: I preferred this kind of style because it leads to excellent `decoupling of Event Producers and Producers`.

## Authors/Contributors
  - [Edward Iga Kigongo](github.com/igakigongo)

