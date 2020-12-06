import P5 from 'p5'
import { figureImagePath } from './figures.js'


const sketch = s => {

  let squareSize = 70
  let ROWS = 8
  let COLS = 8

  function Figure(type, player) {
    // Load the associated image for this figure
    if (player === 'white') {
      if (type === 'pawn') {
        this.image = s.loadImage(figureImagePath.pawnWhiteImagePath)
      } else if (type === 'knight') {
        this.image = s.loadImage(figureImagePath.knightWhiteImagePath)
      } else if (type === 'bishop') {
        this.image = s.loadImage(figureImagePath.bishopWhiteImagePath)
      } else if (type === 'rook') {
        this.image = s.loadImage(figureImagePath.rookWhiteImagePath)
      } else if (type === 'queen') {
        this.image = s.loadImage(figureImagePath.queenWhiteImagePath)
      } else if (type === 'king') {
        this.image = s.loadImage(figureImagePath.kingWhiteImagePath)
      }
    } else if (player === 'black') {
      if (type === 'pawn') {
        this.image = s.loadImage(figureImagePath.pawnBlackImagePath)
      } else if (type === 'knight') {
        this.image = s.loadImage(figureImagePath.knightBlackImagePath)
      } else if (type === 'bishop') {
        this.image = s.loadImage(figureImagePath.bishopBlackImagePath)
      } else if (type === 'rook') {
        this.image = s.loadImage(figureImagePath.rookBlackImagePath)
      } else if (type === 'queen') {
        this.image = s.loadImage(figureImagePath.queenBlackImagePath)
      } else if (type === 'king') {
        this.image = s.loadImage(figureImagePath.kingBlackImagePath)
      }
    }
  }

  function Square(x, y, fill, figure=null) {
    // One square, which can hold one of the available figures

    // Coordinates of the square
    this.x = x*squareSize
    this.y = y*squareSize

    // Determines which square on the board it is
    this.squareX = x
    this.squareY = y

    // Colors of square
    this.fill = fill
    this.inactiveFill = fill
    this.activeFill = s.color(255, 204, 0)

    // Figure associated with this square
    this.figure = figure
    console.log(figure)

    // Used to update display of this particular square
    this.display = function() {
      s.fill(this.fill)
      s.square(this.x, this.y, squareSize)
      if (this.figure) {
        s.image(this.figure.image, this.x, this.y, squareSize, squareSize)
      }
    }

    // Returns which squares the figure on this particular square is allowed to
    // move to
    this.getMoves = function() {
      if (this.figure) {
        return true
      } else {
        return null
      }
    }

    // Returns whether this particular square was clicked or not
    this.wasClicked = function() {
      let d = s.dist(s.mouseX, s.mouseY, this.x + squareSize/2, this.y +
        squareSize/2)
      if (d < squareSize/2) {
        return true
      } else {
        return false
      }
    }

    // Sets the color of the square
    this.updateColor = function(state) {
      if (state === 'active') {
        this.fill = this.activeFill
      } else if (state === 'inactive') {
        this.fill = this.inactiveFill
      }
    }
  }

  let squares = []

  s.setup = () => {
    s.createCanvas(squareSize*ROWS, squareSize*COLS)

    // Draw chess board
    let currentIsWhite = true
    let fill = 225
    let figure
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        if (currentIsWhite) {
          fill = s.color(181, 136, 99)
        } else {
          fill = s.color(240, 217, 181)
        }

        // Figures
        if (row === 0 && col === 0) {
          figure = new Figure('rook', 'black')
        } else if (row === 0 && col === 1) {
          figure = new Figure('knight', 'black')
        } else if (row === 0 && col === 2) {
          figure = new Figure('bishop', 'black')
        } else if (row === 0 && col === 3) {
          figure = new Figure('queen', 'black')
        } else if (row === 0 && col === 4) {
          figure = new Figure('king', 'black')
        } else if (row === 0 && col === 5) {
          figure = new Figure('bishop', 'black')
        } else if (row === 0 && col === 6) {
          figure = new Figure('knight', 'black')
        } else if (row === 0 && col === 7) {
          figure = new Figure('rook', 'black')
        } else if (row === 1) {
          figure = new Figure('pawn', 'black')
        } else if (row === 7 && col === 0) {
          figure = new Figure('rook', 'white')
        } else if (row === 7 && col === 1) {
          figure = new Figure('knight', 'white')
        } else if (row === 7 && col === 2) {
          figure = new Figure('bishop', 'white')
        } else if (row === 7 && col === 3) {
          figure = new Figure('queen', 'white')
        } else if (row === 7 && col === 4) {
          figure = new Figure('king', 'white')
        } else if (row === 7 && col === 5) {
          figure = new Figure('bishop', 'white')
        } else if (row === 7 && col === 6) {
          figure = new Figure('knight', 'white')
        } else if (row === 7 && col === 7) {
          figure = new Figure('rook', 'white')
        } else if (row === 6) {
          figure = new Figure('pawn', 'white')
        } else {
          figure = null
        }
        let square = new Square(col, row, fill, figure)
        square.display()
        squares.push(square)
        currentIsWhite = !currentIsWhite
      }
      currentIsWhite = !currentIsWhite
    }
  }

  s.mousePressed = () => {
    for (let square of squares) {
      if (square.wasClicked()) {
        square.updateColor('active')
      } else {
        square.updateColor('inactive')
      }
    }
  }

  s.draw = () => {
    for (let square of squares) {
      square.display()
    }
  }

  // create methods:
  s.yourMethod = (x, y) => {
    // your method
    console.log(x)
    console.log(y)
  }
}

export function createBoard() {
  return new P5(sketch, 'board');
}
