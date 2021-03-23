import P5 from 'p5'

import {
  figureImagePath,
  pawnMoves,
  knightMoves,
  bishopMoves,
  queenMoves,
  rookMoves,
  kingMoves
} from './figures.js'

// These are board props
export let squareSize = 70
export let ROWS = 8
export let COLS = 8
export let moveNum = 1

const sketch = s => {

  // Global variables
  // let states = [
    // 'whitePassive',
    // 'whiteActive',
    // 'blackPassive',
    // 'blackActive'
  // ]

  // let actions = [
    // 'squareWithFigureClicked',
    // 'movableSquareClicked',
    // 'nonMovableSquareClicked'
  // ]

  // State of the game (which player is in which phase)
  let state = 'whitePassive'

  // The one sqaure that was clicked on
  let activeSquare

  // All squares of the board, some containing figures some not
  let squares = []

  // Matrix representation of the board
  let squaresXY = []

  // Tracks which player is currently playing
  let currentTurn = 'white'

  // Board positions of the two kings
  let whiteKingPos = {}
  let blackKingPos = {}

  function nextState(action) {
    // Determines what the next state will be, depending on the current state
    // and the action that was performed
    // Available combinations:
    // whitePassive, squareWithFigureClicked => whiteActive
    // whiteActive, nonMovableSquareClicked => whitePassive
    // whiteActive, movableSquareClicked => blackPassive
    // blackPassive, squareWithFigureClicked => blackActive
    // blackActive, nonMovableSquareClicked => blackPassive
    // blackActive, movableSquareClicked => whiteActive
    if (state === 'whitePassive' && action === 'squareWithFigureClicked') {
      state = 'whiteActive'
    } else if (state === 'whiteActive' && action === 'nonMovableSquareClicked') {
      state = 'whitePassive'
    } else if (state === 'whiteActive' && action === 'movableSquareClicked') {
      state = 'blackPassive'
      currentTurn = 'black'
    } else if (state === 'blackPassive' && action === 'squareWithFigureClicked') {
      state = 'blackActive'
    } else if (state === 'blackActive' && action === 'nonMovableSquareClicked') {
      state = 'blackPassive'
    } else if (state === 'blackActive' && action === 'movableSquareClicked') {
      state = 'whitePassive'
      moveNum++
      currentTurn = 'white'
    }
  }

  function Figure(type, player) {
    // Save which type of figure and which player it is
    this.type = type
    this.player = player

    // Load image and moveset for this particular figure
    if (player === 'white') {
      if (type === 'pawn') {
        this.image = s.loadImage(figureImagePath.pawnWhiteImagePath)
        this.moves = pawnMoves
      } else if (type === 'knight') {
        this.image = s.loadImage(figureImagePath.knightWhiteImagePath)
        this.moves = knightMoves
      } else if (type === 'bishop') {
        this.image = s.loadImage(figureImagePath.bishopWhiteImagePath)
        this.moves = bishopMoves
      } else if (type === 'rook') {
        this.image = s.loadImage(figureImagePath.rookWhiteImagePath)
        this.moves = rookMoves
      } else if (type === 'queen') {
        this.image = s.loadImage(figureImagePath.queenWhiteImagePath)
        this.moves = queenMoves
      } else if (type === 'king') {
        this.image = s.loadImage(figureImagePath.kingWhiteImagePath)
        this.moves = kingMoves
      }
    } else if (player === 'black') {
      if (type === 'pawn') {
        this.image = s.loadImage(figureImagePath.pawnBlackImagePath)
        this.moves = pawnMoves
      } else if (type === 'knight') {
        this.image = s.loadImage(figureImagePath.knightBlackImagePath)
        this.moves = knightMoves
      } else if (type === 'bishop') {
        this.image = s.loadImage(figureImagePath.bishopBlackImagePath)
        this.moves = bishopMoves
      } else if (type === 'rook') {
        this.image = s.loadImage(figureImagePath.rookBlackImagePath)
        this.moves = rookMoves
      } else if (type === 'queen') {
        this.image = s.loadImage(figureImagePath.queenBlackImagePath)
        this.moves = queenMoves
      } else if (type === 'king') {
        this.image = s.loadImage(figureImagePath.kingBlackImagePath)
        this.moves = kingMoves
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
    this.activeFill = s.color(41, 204, 57)
    this.movableFill = s.color(255, 204, 0)

    // Figure associated with this square
    this.figure = figure
    this.isActive = false
    this.isMovable = false

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
    this.getMoves = function(board) {
      if (this.figure) {
        return this.figure.moves(this.squareX, this.squareY,
          this.figure.player, board)
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

    // Sets the state of the square
    this.updateState = function(state) {
      if (state === 'active') {
        this.fill = this.activeFill
        this.isActive = true
        this.isMovable = false
      } else if (state === 'inactive') {
        this.fill = this.inactiveFill
        this.isActive = false
        this.isMovable = false
      } else if (state === 'movable') {
        this.fill = this.movableFill
        this.isActive = false
        this.isMovable = true
      }
    }
  }

  // Displays algebraic notation on chess board
  function addNotation() {
    let bottomRow = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

    for (let row = 0; row < ROWS; row += 1) {
        s.textSize(10)
        s.fill(50)
        s.text(ROWS - row, 3, row*squareSize + 13);
    }

    for (let col = 0; col < COLS; col += 1) {
        s.textSize(10)
        s.fill(50)
        s.text(bottomRow[col], col*squareSize + 60, (ROWS - 1)*squareSize + 0.95*squareSize);
    }
  }

  // Checks if the king is being attacked in the current board configuration
  function isKingChecked() {
    for (let square of squares) {
      // We're only interested in opponent's figures
      if (!square.figure || square.figure.player === currentTurn) {
        continue
      } else {
        // We take the available moves of the opponents figure, and check if
        // the king is among the available moves
        let moves = square.getMoves(squaresXY)
        for (let move of moves) {
          if (currentTurn === 'white' && move.x === whiteKingPos.x && move.y === whiteKingPos.y) {
            return true
          } else if (currentTurn === 'black' && move.x === blackKingPos.x && move.y === blackKingPos.y) {
            return true
          }
        }
      }
    }
    return false
  }

  // Sets a game up
  function createGame() {
    // Set initial state
    state = 'whitePassive'
    activeSquare = null
    squares = []
    squaresXY = []
    moveNum = 1
    currentTurn = 'white'

    // Draw chess board
    let currentIsWhite = false
    let fill = 225
    let figure
    for (let row = 0; row < ROWS; row += 1) {
      squaresXY.push([])
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
          // Set initial position for black king
          blackKingPos = {x: col, y: row}
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
          // Set initial position for white king
          whiteKingPos = {x: col, y: row}
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
        squaresXY[row].push(square)
        currentIsWhite = !currentIsWhite
      }
      currentIsWhite = !currentIsWhite
    }
  }

  s.setup = () => {
    s.createCanvas(squareSize*ROWS, squareSize*COLS)
    createGame()
  }

  s.mousePressed = () => {
    // Handles what happens when players interact with the board
    let moves = null
    for (let square of squares) {
      if (square.wasClicked()) {
        if (square.isMovable) {
          // Check if the figure that's being eaten a king
          if (square.figure && square.figure.type === 'king') {
            createGame()
            break
          }

          if (isKingChecked()) {
            console.log('KING IS BEING ATTACKED')
          }

          // Check if the figure being moved is a king and update king position
          // if it is
          if (activeSquare.figure.type === 'king') {
            if (currentTurn === 'white') {
              whiteKingPos.x = square.squareX
              whiteKingPos.y = square.squareY
            } else {
              blackKingPos.x = square.squareX
              blackKingPos.y = square.squareY
            }
          }

          // We move the figure to the new square
          square.figure = activeSquare.figure
          activeSquare.figure = null
          square.updateState('inactive')
          nextState('movableSquareClicked')
        } else if (square.figure) {
          // We make the square active if it's the current player's figure
          if ((currentTurn === 'white' && square.figure.player === 'white') ||
          (currentTurn === 'black' && square.figure.player === 'black')) {
            square.updateState('active')
            moves = square.getMoves(squaresXY)
            activeSquare = square
            nextState('squareWithFigureClicked')
          }
        } else {
            nextState('nonMovableSquareClicked')
        }
      } else {
        square.updateState('inactive')
      }
    }

    // Now draw fields to which you can move
    if (moves) {
      for (let move of moves) {
        squaresXY[move.y][move.x].updateState('movable')
      }
    }
  }

  s.draw = () => {
    for (let square of squares) {
      square.display()
    }
    addNotation()
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
