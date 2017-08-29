"use strict";

const mineSweeper = {
  init: function() {
    this.renderBoard();
    this.setButtonText(':)');
    this.setTimer(0);
    this.setMines(10);
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
  }
};

function main() {
  mineSweeper.init();
}

$(document).ready(main());
