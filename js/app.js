const controller = (function(){

  const boardShell = document.getElementById("board-shell");

  function createGridCell(key){
    console.log(key);
    const cell = document.createElement("div");
    cell.innerText = key + 1;
    cell.style.border = "2px dashed #fff";
    cell.style.borderRadius = "6px 8px";
    cell.style.minHeight = "100px";
    cell.style.padding = "15px";
    cell.style.textAlign = "center";

    cell.style.display = "flex";
    cell.style.flexDirection = "column";
    cell.style.justifyContent = "center";

    cell.style.fontSize = "1.5rem";
    
    return cell;
  }

  function render(){  
    const boardSize = gameBoard.size();

    boardShell.style.display = "grid";
    boardShell.style.columnGap = "15px";
    boardShell.style.gridTemplateColumns = `repeat(${Math.sqrt(boardSize)}, 1fr)`;
    boardShell.style.rowGap = "15px";

    const cells = [...new Array(9).keys()].map(function(key){
      return createGridCell(key)
    });

    boardShell.append(...cells);
  }

  return {
    render
  }
})();

document.addEventListener("DOMContentLoaded", controller.render)