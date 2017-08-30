"use strict";

// TODO Implement different difficulty settings

const emoji = {
  smile: '😌',
  openMouth: '😨',
  sunglasses: '😎',
  frown: '😖',
  bomb: '💣',
  tick: '✔',
  explode: '💥'
};

const mineSweeper = {
  init: function() {
    this.renderBoard();
    this.setButtonText(emoji.smile);
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
    this.mineCount = int;
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
    this.gameFinished = true;
  },
  gameLost: function(clickedBomb) {
    this.setButtonText(emoji.frown);
    this.cells.filter((cell) => { return cell.mine }).forEach((mine) => {
      const $cell = $(`[data-position=${mine.id}]`);
      $cell.addClass('mine');
      $cell.text(emoji.bomb);
      $(clickedBomb).text(emoji.explode);
    });
    this.gameOver()
  },
  gameWon: function() {
    this.setButtonText(emoji.sunglasses);
    this.cells.filter((cell) => { return cell.mine }).forEach((mine) => {
      const $cell = $(`[data-position=${mine.id}]`);
      $cell.addClass('mine-won');
      $cell.text(emoji.tick);
    });
    this.gameOver();
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
      this.gameLost(node);
    }
  }
};

function Cell(id) {
  Cell.prototype.marked = false;
  Cell.prototype.mine = false;
  this.number = 0;
  Cell.prototype.incrementNumber = function() {
    this.number++;
  }
  this.id = id
}

function main() {

  // Initialize minesweeper board
  mineSweeper.init();

  // Cell event handlers

    let $cell = $('.cell');

    // Prevent context menu on cells
    $cell.on('contextmenu', function() {
      return false
    });

    // Handle mouse down on cell
    $cell.mousedown(function(event) {
      if (!mineSweeper.gameFinished) {
        // Animate game button on left mousedown
        if (event.which === 1 && !$(this).hasClass('clicked')) {
          mineSweeper.setButtonText(emoji.openMouth);
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
          mineSweeper.setButtonText(emoji.smile);
          if (!$(this).hasClass('clicked')) {
            mineSweeper.clickCell(this)
          }

          // Reset mine count to 10 - amount of '!' on the board
          const currentMinesMarked = $(".cell:contains('!')").length;
          mineSweeper.setMines(10 - currentMinesMarked);
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

        // Check if game is won
        if (mineSweeper.checkWin()) {
          mineSweeper.gameWon();
        }
      }
    });
}

$(document).ready(() => {

  //Initialize main function on document load
  main();

  //Animate game board visibility
  $('#game').animate({
    bottom: "0"
  }, {
    duration: 1000,
    easing: 'easeOutBounce'
  });

  // Handle click on game button
  $('#game-button').click(() => {
    const $game = $('#game');
    $game.animate({
      left: '-=1500'
    }, {
      duration: 500,
      easing: 'easeInBack',
      complete: () => {
        $game.addClass('invisible');
        $game.animate({
          left: '+=3000'
        }, {
          duration: 0,
          complete: () => {
            mineSweeper.gameOver();
            main();
            $game.removeClass('invisible');
            $game.animate({
              left: '-=1500'
            }, {
              duration: 400,
              easing: 'easeOutBack'
            });
          }
        });
      }
    });
  });
});
