"use strict";

function Cell() {
  Cell.prototype.marked = false;
  Cell.prototype.mine = false;
  this.number = 0;
  Cell.prototype.incrementNumber = function() {
    this.number++;
  }
}

const mineSweeper = {
  init: function() {
    this.renderBoard();
    this.setButtonText(':)');
    this.setTimer(0);
    this.mineCount = 10;
    this.setMines(this.mineCount);
    this.createCells();
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
  createCells: function() {

    // Function for getting surrounding cells from index
    function getSurroundingCells(index) {
      const surroundingCells = [];
      const sqrt = Math.sqrt(cells.length);
      let up = false;
      let down = false;
      if (index >= sqrt) {
        surroundingCells.push(cells[index - sqrt]);
        up = true;
      }
      if (index < cells.length - sqrt) {
        surroundingCells.push(cells[index + sqrt]);
        down = true;
      }
      if (index % sqrt !== 0) {
        surroundingCells.push(cells[index - 1]);
        if (up) {
          surroundingCells.push(cells[index - sqrt - 1])
        }
        if (down) {
          surroundingCells.push(cells[index + sqrt - 1])
        }
      }
      if ((index + 1) % sqrt !== 0) {
        surroundingCells.push(cells[index + 1]);
        if (up) {
          surroundingCells.push(cells[index - sqrt + 1])
        }
        if (down) {
          surroundingCells.push(cells[index + sqrt + 1])
        }
      }
      return surroundingCells
    }

    // Populate cells list with cells
    this.cells = [];
    const cells = this.cells;
    [...new Array(100).keys()].forEach(() => {
      this.cells.push(new Cell());
    });

    // Initialize cells with game values

      // Initialize cells with mines
      _.sampleSize(this.cells, 10).forEach((cell) => {
        cell.mine = true;
      });

      // Initialize cells with numbers
      this.cells.forEach((cell, index) => {
        if (cell.mine) {
          getSurroundingCells(index).forEach((cell, index) => { cell.number++ })
        }
      });
  },
  containsMine: function(cell) {
    return this.cells[$(cell).data('position')].mine;
  },
  getNumber: function(cell) {
    return this.cells[$(cell).data('position')].number;
  }
};

function main() {

  // Initialize minesweeper board
  mineSweeper.init();

  // Cell event handlers
  let $cell = $('.cell');
  $cell.on('contextmenu', function() {
    return false
  });
  $cell.mousedown(function(event) {

    // Animate game button on left mousedown
    if (event.which === 1 && !$(this).hasClass('clicked')) {
      mineSweeper.setButtonText(':o');
    }
  });
  $cell.mouseup(function(event) {

    // Add style to clicked cell and animate game button on left mouseup -- cycle cell symbol on right mouseup
    if (event.which === 1) {
      if (!$(this).hasClass('clicked') && !mineSweeper.containsMine(this)) { $(this).addClass('clicked'); $(this).text(mineSweeper.getNumber(this)) }
      mineSweeper.setButtonText(':)');
    } else if (event.which === 3) {
      let text = $(this).text();
      if (text === '') {
        $(this).text('!');
        mineSweeper.decrementMines();
      } else if (text === '!') {
        $(this).text('?');
        mineSweeper.incrementMines();
      } else if (text === '?') {
        $(this).text('');
      }
    }
  });
}

$(document).ready(main());
