/* global createPlayer, events, gameBoard */

const controller = (function() {
  const controllerRef = this;
  const boardShell = document.getElementById('board-shell');

  let currentPlayer, playerOne, playerTwo;

  function clearGrid(){
    while(boardShell.firstChild){
      boardShell.removeChild(boardShell.firstChild);
    }
    render();
  }

  function createAndDispatchCurrentPlayerChangedEvent(){
    const event = new CustomEvent(events.CURRENT_PLAYER_CHANGED, {
      detail: { player: currentPlayer }
    });
    controllerRef.dispatchEvent(event);
  }

  function createGridCell(key) {
    const { clientWidth } = document.body;

    const cell = document.createElement('div');
    cell.dataset.value = key;
    cell.innerText = key + 1;
    cell.style.border = '2px dashed #fff';
    cell.style.borderRadius = '6px 8px';
    cell.style.minHeight = clientWidth <= 320 ? '34px' : '100px';
    cell.style.minWidth = clientWidth <= 320 ? '34px' : '100px';
    cell.style.padding = clientWidth <= 320 ? '10px' : '15px';
    cell.style.textAlign = 'center';

    cell.style.display = 'flex';
    cell.style.flexDirection = 'column';
    cell.style.justifyContent = 'center';

    cell.style.fontSize = '1.5rem';

    cell.setAttribute('id', `cell-${key}`);
    cell.addEventListener('click', function(evt) {

      if (!currentPlayer){
        window.alert('Please first set up the players');
        return;
      }

      const { symbol } = currentPlayer;
      const { value } = evt.target.dataset;

      const event = new CustomEvent(events.MOVE_PLAYED, { detail: { symbol, value } });
      controllerRef.dispatchEvent(event);
    });

    return cell;
  }

  function render() {
    const cells = [...new Array(9).keys()].map(function(key) {
      return createGridCell(key);
    });

    boardShell.style.columnGap = '15px';
    boardShell.style.display = 'grid';
    boardShell.style.gridTemplateColumns = `repeat(${Math.sqrt(gameBoard.totalSlots())}, 1fr)`;
    boardShell.style.rowGap = '15px';
    boardShell.append(...cells);
  }

  controllerRef.addEventListener(events.NEW_GAME_INITIATED, function(){
    // Reset Players
    currentPlayer = null;
    playerOne = null;
    playerTwo = null;
    clearGrid();
  });

  controllerRef.addEventListener(events.PLAYER_NAMES_RECEIVED, function(evt) {
    const [playerOneName, playerTwoName] = evt.detail;
    playerOne = createPlayer(playerOneName, 'X');
    playerTwo = createPlayer(playerTwoName, 'O');
    currentPlayer = playerOne;
    createAndDispatchCurrentPlayerChangedEvent();
  });

  controllerRef.addEventListener(events.RESTART_CURRENT_GAME, function(){
    clearGrid();
    currentPlayer = playerOne;
    createAndDispatchCurrentPlayerChangedEvent();
  });

  controllerRef.addEventListener(events.SYMBOL_PLACED, function(evt) {
    const { symbol, value: index } = evt.detail;

    // Update the UI
    const cell = boardShell.querySelector(`#cell-${index}`);
    cell.innerText = symbol;
    cell.style.color = '#fff';
    cell.style.fontSize = '3.5rem';

    // Check if the game is won
    const winningSymbol = gameBoard.winningSymbol();
    if (winningSymbol) {
      const winEvent = new CustomEvent(events.GAME_WON, { detail: { winner: currentPlayer } });
      controllerRef.dispatchEvent(winEvent);
      return;
    }

    // Check if we have more free cells
    if (gameBoard.freeSlots() === 0) {
      const drawEvent = new Event(events.GAME_DRAWN);
      controllerRef.dispatchEvent(drawEvent);
      return;
    } 
		
    currentPlayer = currentPlayer.equals(playerOne) ? playerTwo : playerOne;
    createAndDispatchCurrentPlayerChangedEvent();
  });

  controllerRef.addEventListener(events.SYMBOL_PLACEMENT_REJECTED, function(evt) {
    const index = +evt.detail.value;
    window.alert(`The cell (${index + 1}) is already occupied`);
  });

  return {
    render
  };
})();

document.addEventListener('DOMContentLoaded', controller.render);
