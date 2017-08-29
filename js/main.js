"use strict";

function Cell(id) {
  Cell.prototype.marked = false;
  Cell.prototype.mine = false;
  this.number = 0;
  Cell.prototype.incrementNumber = function() {
    this.number++;
  }
  this.id = id
}

const mineSweeper = {
  init: function() {
    this.renderBoard();
    this.setButtonText(':)');
    this.timeCount = 0;
    this.setTimer(this.timeCount);
    this.mineCount = 10;
    this.setMines(this.mineCount);
    this.createCells();
    this.started = false;
    this.gameFinished = false;
  },
  renderBoard: function() {
    function createGrid() {
      let cellCounter = 0;
      let gridElement = [];
      function createCell(n) {
        return `<div data-position="${n}" class="cell"></div>`
      }
      function createRow() {
        let row = [];
        row.push('<div class="row">');
        [...new Array(10).keys()].forEach(() => { row.push(createCell(cellCounter)); cellCounter++ });
        row.push('</div>');
        return row
      }
      [...new Array(10).keys()].forEach(() => {
        gridElement.push(createRow());
      });
      return gridElement.map((row) => { return row.join('') }).join('');
    }
    const $board = $('#gameboard');
    $board.empty();
    $board.append(createGrid());
  },
  setButtonText: function(string) {
    $('#game-button').text(string);
  },
  setTimer: function(int) {
    $('#timer').text(int.toString());
  },
  setMines: function(int) {
    $('#mines-left').text(int.toString());
  },
  decrementMines: function() {
    this.mineCount--;
    this.setMines(this.mineCount);
  },
  incrementMines: function() {
    this.mineCount++;
    this.setMines(this.mineCount);
  },
  getSurroundingCells: function(index) {
    const surroundingCells = [];
    const sqrt = Math.sqrt(this.cells.length);
    let up = false;
    let down = false;
    if (index >= sqrt) {
      surroundingCells.push(this.cells[index - sqrt]);
      up = true;
    }
    if (index < this.cells.length - sqrt) {
      surroundingCells.push(this.cells[index + sqrt]);
      down = true;
    }
    if (index % sqrt !== 0) {
      surroundingCells.push(this.cells[index - 1]);
      if (up) {
        surroundingCells.push(this.cells[index - sqrt - 1])
      }
      if (down) {
        surroundingCells.push(this.cells[index + sqrt - 1])
      }
    }
    if ((index + 1) % sqrt !== 0) {
      surroundingCells.push(this.cells[index + 1]);
      if (up) {
        surroundingCells.push(this.cells[index - sqrt + 1])
      }
      if (down) {
        surroundingCells.push(this.cells[index + sqrt + 1])
      }
    }
    return surroundingCells
  },
  createCells: function() {

    // Populate cells list with cells
    this.cells = [];
    [...new Array(100).keys()].forEach((n) => {
      this.cells.push(new Cell(n));
    });

    // Initialize cells with game values

      // Initialize cells with mines
      _.sampleSize(this.cells, 10).forEach((cell) => {
        cell.mine = true;
      });

      // Initialize cells with numbers
      this.cells.forEach((cell, index) => {
        if (cell.mine) {
          this.getSurroundingCells(index).forEach((cell) => { cell.number++ })
        }
      });
  },
  gameOver: function() {
    clearInterval(this.timer);
    this.setButtonText(':(');
    this.cells.filter((cell) => { return cell.mine }).forEach((mine) => {
      $(`[data-position=${mine.id}]`).addClass('mine');
    });
    this.gameFinished = true;
  },
  checkWin: function() {
    return this.cells.filter((cell) => { return cell.mine }).every((mine) => {
      return $(`[data-position=${mine.id}]`).text() === '!';
    })
  },
  begin: function() {
    this.started = true;
    this.timer = setInterval(() => { this.setTimer(this.timeCount++) }, 1000);
  },
  clickCell: function(node) {
    function clickNode(node) {
      const cell = cells[$(node).data('position')];
      $(node).addClass('clicked');
      $(node).text(cell.number);
    }
    function propagateClick(node, first = true) {
      let currentCell = cells[$(node).data('position')];
      if (first) clickNode(node);
      if ((currentCell.number !== 0 && !first) || currentCell.mine) return false;
      if (currentCell.number === 0) {
        clickNode(node);
        getSurroundingCells(currentCell.id).map((cell) => {
          return $(`[data-position=${cell.id}]`).get(0);
        }).filter((node) => {
          return !$(node).hasClass('clicked');
        }).forEach((node) => {
          clickNode(node);
          propagateClick(node);
        });
      }
    }
    const cells = this.cells;
    const cell = cells[$(node).data('position')];
    const getSurroundingCells = this.getSurroundingCells.bind(this);
    if (!cell.mine) {
      propagateClick(node, true);
    } else {
      this.gameOver();
    }
  }
};

function main() {

  // Initialize minesweeper board
  mineSweeper.init();

  //Handle click on game button

  $('#game-button').click(() => {
    mineSweeper.gameOver();
    main();
  });

  // Cell event handlers
  let $cell = $('.cell');
  $cell.on('contextmenu', function() {
    return false
  });

  // Handle mouse down on cell
  $cell.mousedown(function(event) {
    if (!mineSweeper.gameFinished) {
      // Animate game button on left mousedown
      if (event.which === 1 && !$(this).hasClass('clicked')) {
        mineSweeper.setButtonText(':o');
      }
    }
  });

  // Handle mouse up on cell
  $cell.mouseup(function(event) {

    // Start timer
    if (!mineSweeper.started) mineSweeper.begin();

    if (!mineSweeper.gameFinished) {

      // Add style to clicked cell and animate game button on left mouseup -- cycle cell symbol on right mouseup
      if (event.which === 1) {
        mineSweeper.setButtonText(':)');
        if (!$(this).hasClass('clicked')) {
          mineSweeper.clickCell(this)
        }
      } else if (event.which === 3) {
        let text = $(this).text();
        if (text === '') {
          if (mineSweeper.mineCount !== 0) {
            $(this).text('!');
            mineSweeper.decrementMines();
          } else {
            $(this).text('?');
          }
        } else if (text === '!') {
          if (mineSweeper.mineCount !== 10) {
            $(this).text('?');
            mineSweeper.incrementMines();
          }
        } else if (text === '?') {
          $(this).text('');
        }
      }
    }

    // Check if game is won
    console.log(mineSweeper.checkWin());
  });
}

$(document).ready(main());
