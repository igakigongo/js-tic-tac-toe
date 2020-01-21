const controller = (function() {
	const controllerRef = this;

	const boardShell = document.getElementById("board-shell");

	const [playerOne, playerTwo] = [createPlayer("Edward", "X"), createPlayer("Joshua", "O")];
	let currentPlayer = playerOne;

	function createGridCell(key) {
		const { clientWidth } = document.body;

		const cell = document.createElement("div");
		cell.dataset.value = key;
		cell.innerText = key + 1;
		cell.style.border = "2px dashed #fff";
		cell.style.borderRadius = "6px 8px";
		cell.style.minHeight = clientWidth <= 320 ? "34px" : "100px";
		cell.style.minWidth = clientWidth <= 320 ? "34px" : "100px";
		cell.style.padding = clientWidth <= 320 ? "10px" : "15px";
		cell.style.textAlign = "center";

		cell.style.display = "flex";
		cell.style.flexDirection = "column";
		cell.style.justifyContent = "center";

		cell.style.fontSize = "1.5rem";

		cell.setAttribute("id", `cell-${key}`);
		cell.addEventListener("click", function(evt) {
			const { symbol } = currentPlayer;
			const { value } = evt.target.dataset;
			const event = new CustomEvent(events.MOVE_PLAYED, { detail: { symbol, value } });
			controllerRef.dispatchEvent(event);
		});

		return cell;
	}

	function render() {
		boardShell.style.display = "grid";
		boardShell.style.columnGap = "15px";
		boardShell.style.gridTemplateColumns = `repeat(${Math.sqrt(gameBoard.totalSlots())}, 1fr)`;
		boardShell.style.rowGap = "15px";

		const cells = [...new Array(9).keys()].map(function(key) {
			return createGridCell(key);
		});

		boardShell.append(...cells);
	}

	controllerRef.addEventListener(events.SYMBOL_PLACED, function(evt) {
		const { symbol, value: index } = evt.detail;

		// Update the UI
		const cell = boardShell.querySelector(`#cell-${index}`);
		cell.innerText = symbol;
		cell.style.fontSize = "3.5rem";
		cell.style.color = "#fff";

		// Check if the game is won
		const winningSymbol = gameBoard.winningSymbol();
		if (winningSymbol) {
			window.alert(`The game is won by ${currentPlayer.name}`);
			return;
		}

		// Check if we have more free cells
		if (gameBoard.freeSlots() === 0) {
			window.alert("The game is a draw");
		} else {
			currentPlayer = currentPlayer.equals(playerOne) ? playerTwo : playerOne;
		}
	});

	controllerRef.addEventListener(events.SYMBOL_PLACEMENT_REJECTED, function(evt) {
		const index = +evt.detail.value;
		window.alert(`The cell (${index + 1}) is already occupied`);
	});

	return {
		render
	};
})();

document.addEventListener("DOMContentLoaded", controller.render);
