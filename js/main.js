"use strict";

const mineSweeper = {
  init: function() {
    this.renderBoard();
    this.setButtonText(':)');
    this.setTimer(0);
    this.mineCount = 10;
    this.setMines(this.mineCount);
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
  containsMine: function(cell) {
    // TODO implement checker for mine inside cell
  },
  getNumber: function(cell) {
    // TODO Implement number-of-bombs checker for cell
    return '0'
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
      if (!$(this).hasClass('clicked')) { $(this).addClass('clicked'); $(this).text(mineSweeper.getNumber(this)) }
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
