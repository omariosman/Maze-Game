let form = document.querySelector("#settings");
let size = document.querySelector("#size");
let rowsCols = document.querySelector("#number");
let newMaze;
function generateMaze(e) {
  e.preventDefault();
  if (rowsCols.value == "" || size.value == "") {
    return alert("The input is empty");
  }
  let mazeSize = size.value;
  let number = rowsCols.value;
  if (mazeSize > 600 || number > 50) {
    alert("Please choose smaller number");
    return;
  }
  form.style.display = "none";
  newMaze = new Maze(mazeSize, number, number);
  newMaze.ready();
  newMaze.doIt();
}
function move(e) {
  if (!endFlag) return;
  let key = e.key;
  let row = current.rowNum;
  let col = current.colNum;
  switch (key) {
    case "ArrowUp":
      if (!current.Borders.topBorder) {
        let next = newMaze.grid[row - 1][col];
        current = next;
        newMaze.doIt();
        current.highlight(newMaze.columns);
      }
      break;
    case "ArrowRight":
      if (!current.Borders.rightBorder) {
        let next = newMaze.grid[row][col + 1];
        current = next;
        newMaze.doIt();
        current.highlight(newMaze.columns);
      }
      break;
    case "ArrowDown":
      if (!current.Borders.bottomBorder) {
        let next = newMaze.grid[row + 1][col];
        current = next;
        newMaze.doIt();
        current.highlight(newMaze.columns);
      }
      break;
    case "ArrowLeft":
      if (!current.Borders.leftBorder) {
        let next = newMaze.grid[row][col - 1];
        current = next;
        newMaze.doIt();
        current.highlight(newMaze.columns);
      }
      break;
  }
}
form.addEventListener("submit", generateMaze);
document.addEventListener("keydown", move);