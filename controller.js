let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");
let endFlag = false;

let current;
let destination;

class Maze {
  constructor(size, rows, columns) {
    this.size = size;
    this.columns = columns;
    this.rows = rows;
    this.grid = [];
    this.stack = [];
  }

  ready() {
    for (let r = 0; r < this.rows; r++) {
      let row = [];
      for (let c = 0; c < this.columns; c++) {
        let cell = new Cell(r, c, this.grid, this.size);
        row.push(cell);
      }
      this.grid.push(row);
    }
    current = this.grid[0][0];
    this.grid[this.rows - 1][this.columns - 1].destination = true;
  }

  doIt() {
    maze.width = this.size;
    maze.height = this.size;
    maze.style.background = "black";
    current.visited = true;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let grid = this.grid;
        grid[r][c].show(this.size, this.rows, this.columns);
      }
    }
    let next = current.checkNeighbours();
    if (next) {
      next.visited = true;
      this.stack.push(current);
      current.highlight(this.columns);
      current.removeBorders(current, next);
      current = next;

    } else if (this.stack.length > 0) {
      let cell = this.stack.pop();
      current = cell;
      current.highlight(this.columns);
    }
    if (this.stack.length === 0) {
      endFlag = true;
      return;
    }
    window.requestAnimationFrame(() => {
      this.doIt();
    });
  }
}
class Cell {
  constructor(rowNum, colNum, parentGrid, parentSize) {
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.visited = false;
    this.Borders = {topBorder: true, rightBorder: true, bottomBorder: true, leftBorder: true};
    this.destination = false;
    this.parentGrid = parentGrid;
    this.parentSize = parentSize;
  }
  checkNeighbours() {
    let grid = this.parentGrid;
    let row = this.rowNum;
    let col = this.colNum;
    let neighbours = [];
    let top, right, bottom, left;
    if (row !== 0){
        top = grid[row - 1][col];
    }else {
        top = undefined;
    }
    if (col !== grid.length - 1 ){
        right = grid[row][col + 1];
    }else {
        right = undefined;
    }
    if ( row !== grid.length - 1 ){
        bottom = grid[row + 1][col];
    }else {
        bottom = undefined;
    }
    if ( col !== 0 ){
        left = grid[row][col - 1];
    }else {
        left = undefined;
    }
    if (top && !top.visited) {
        neighbours.push(top);
    }
    if (right && !right.visited) 
    {   
        neighbours.push(right);
    }
    if (bottom && !bottom.visited) {
        neighbours.push(bottom);
    }
    if (left && !left.visited) {
        neighbours.push(left);
    }
    if (neighbours.length !== 0) {
      let random = Math.floor(Math.random() * neighbours.length);
      return neighbours[random];
    } else {
      return undefined;
    }
  }
  doItTopBorder(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size / columns, y);
    ctx.stroke();
  }
  doItRightBorder(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x + size / columns, y);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }
  doItBottomBorder(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / rows);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }
  doItLeftBorder(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + size / rows);
    ctx.stroke();
  }
  highlight(columns) {
    let x = (this.colNum * this.parentSize) / columns + 1;
    let y = (this.rowNum * this.parentSize) / columns + 1;
    ctx.fillStyle = "#d63031";
    ctx.fillRect(
      x,
      y,
      this.parentSize / columns - 6,
      this.parentSize / columns - 6
    );
  }
  removeBorders(cell1, cell2) {
    let x = cell1.colNum - cell2.colNum;
    if (x === 1) {
      cell1.Borders.leftBorder = false;
      cell2.Borders.rightBorder = false;
    } else if (x === -1) {
      cell1.Borders.rightBorder = false;
      cell2.Borders.leftBorder = false;
    }
    let y = cell1.rowNum - cell2.rowNum;
    if (y === 1) {
      cell1.Borders.topBorder = false;
      cell2.Borders.bottomBorder = false;
    } else if (y === -1) {
      cell1.Borders.bottomBorder = false;
      cell2.Borders.topBorder = false;
    }
  }
  show(size, rows, columns) {
    let x = (this.colNum * size) / columns;
    let y = (this.rowNum * size) / rows;
    ctx.strokeStyle = "#1BF700";
    ctx.fillStyle = "#0F0F13";
    ctx.lineWidth = 10;
    if (this.Borders.topBorder){ 
        this.doItTopBorder(x, y, size, columns, rows);
    }
    if (this.Borders.rightBorder) {
        this.doItRightBorder(x, y, size, columns, rows);
    }
    if (this.Borders.bottomBorder) {
        this.doItBottomBorder(x, y, size, columns, rows);
    }
    if (this.Borders.leftBorder) {
        this.doItLeftBorder(x, y, size, columns, rows);
    }
    if (this.visited) {
      ctx.fillRect(x + 1, y + 1, size / columns - 6, size / rows - 6);
    }
    if (this.destination) {
      ctx.fillStyle = "#fd79a8";
      ctx.fillRect(x + 1, y + 1, size / columns - 6, size / rows - 6);
    }
  }
}