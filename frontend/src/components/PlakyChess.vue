<template>
  <div>
    <div id="board" />
    <v-dialog
      v-model="pawnPromotion.dialog"
      width="500"
      persistent
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Pick a promotion
        </v-card-title>

      <v-container fluid>
        <v-row>
          <v-col>
            <v-radio-group
              v-model="pawnPromotion.figureType"
              class="d-flex justify-center"

            >
              <v-radio
                v-for="n in ['rook', 'knight', 'bishop', 'queen']"
                :key="n"
                :label="`${n}`"
                :value="n"
                />
            </v-radio-group>
          </v-col>
        </v-row>
      </v-container>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="updatePawn"
          >
            Pick
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</div>
</template>

<script>

// Global variables which track whether castling is still available
export let castlingWhiteLeft = true
export let castlingWhiteRight = true
export let castlingBlackLeft = true
export let castlingBlackRight = true

import P5 from 'p5'
import { ROWS, COLS, squareSize } from './settings.js'
import {
  figureImagePath,
  pawnMoves,
  knightMoves,
  bishopMoves,
  queenMoves,
  rookMoves,
  kingMoves
} from './figures.js'

export default {
  name: 'PlakyChess',

  data() {
    return {
      board: null,
      pawnPromotion: { dialog: false, figureType: '', square: null },
      Figure: null
    }
  },

  methods: {
    updatePawn() {
      // Swap the pawn for a new figure
      this.pawnPromotion.square.figure = new this.Figure(
        this.pawnPromotion.figureType,
        this.pawnPromotion.square.figure.player)

      // Clear selected figure type and close dialog
      this.pawnPromotion.figureType = ''
      this.pawnPromotion.dialog = false
    }
  },

  created: function() {

    let moveNum = 1

    const sketch = s => {

      // Global variables for the sketch

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
          console.log(moveNum)
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

      // Bind function to Vue data
      this.Figure = Figure

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
      function isKingChecked(player) {
        for (let square of squares) {
          // We're only interested in opponent's figures
          if (!square.figure || square.figure.player === player) {
            continue
          } else {
            // We take the available moves of the opponents figure, and check if
            // the king is among the available moves
            let moves = square.getMoves(squaresXY)
            for (let move of moves) {
              if (player === 'white' && move.x === whiteKingPos.x && move.y === whiteKingPos.y) {
                return true
              } else if (player === 'black' && move.x === blackKingPos.x && move.y === blackKingPos.y) {
                return true
              }
            }
          }
        }
        return false
      }

      // Handles pawn promotion
      let checkPawnPromotion = (square) => {

        // Check if the figure was a pawn and if it's at the edge of the board
        if (square.figure.type === 'pawn' && square.figure.player === 'white' &&
          square.squareY === 0) {
          this.pawnPromotion.square = square
          this.pawnPromotion.dialog = true
        } else if (square.figure.type === 'pawn' && square.figure.player ===
          'black' && square.squareY === ROWS - 1) {
          this.pawnPromotion.square = square
          this.pawnPromotion.dialog = true
        }
      }

      // Disables castling flags if any of the related figures were moved
      function updateCastlingState(square) {

        // Check if the figure that was moved is a king or a rook and disable
        // the corresponding castling flag
        if (square.figure.type === 'king' && square.figure.player === 'white') {
          castlingWhiteLeft = false
          castlingWhiteRight = false
        } else if  (square.figure.type === 'king' && square.figure.player === 'black') {
          castlingBlackLeft = false
          castlingBlackRight = false
        } else if (square.figure.type === 'rook' && square.figure.player === 'white') {
          // Check which rook was moved and disable corresponding castling flag
          if (square.squareX === 0) {
            castlingWhiteLeft = false
          } else {
            castlingWhiteRight = false
          }
        } else if (square.figure.type === 'rook' && square.figure.player === 'black') {
          // Check which rook was moved and disable corresponding castling flag
          if (square.squareX === 0) {
            castlingBlackLeft = false
          } else {
            castlingBlackRight = false
          }
        }
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

        // Figures that are having an interaction
        let fromFigure = null
        let toFigure = null

        for (let square of squares) {
          if (square.wasClicked()) {
            if (square.isMovable) {
              // Check if the figure that's being eaten a king
              if (square.figure && square.figure.type === 'king') {
                createGame()
                break
              }

              // We move the figure to the new square, but remember the figures
              // because we have to check the validity of the move after moving
              // (should do the check before moving the figure, but too lazy)
              toFigure = square.figure
              fromFigure = activeSquare.figure
              square.figure = activeSquare.figure
              activeSquare.figure = null
              square.updateState('inactive')

              // Check if the figure being moved is a king and update king
              // position if it is
              if (fromFigure.type === 'king') {
                if (currentTurn === 'white') {
                  whiteKingPos.x = square.squareX
                  whiteKingPos.y = square.squareY
                } else {
                  blackKingPos.x = square.squareX
                  blackKingPos.y = square.squareY
                }
              }

              // Check if the king is being attacked after this move
              if (isKingChecked(currentTurn)) {
                // This move is illegal, so we undo the move and break
                square.figure = toFigure
                activeSquare.figure = fromFigure
                for (let square of squares) {
                  square.updateState('inactive')
                }

                // If the figure that was moved was the king, revert the king
                // position tracker back
                if (fromFigure.type === 'king') {
                  if (currentTurn === 'white') {
                    whiteKingPos.x = activeSquare.squareX
                    whiteKingPos.y = activeSquare.squareY
                  } else {
                    blackKingPos.x = activeSquare.squareX
                    blackKingPos.y = activeSquare.squareY
                  }
                }
                break
              }

              // Check if castling was performed, and move the corresponding
              // rook if it was
              if (castlingWhiteLeft && currentTurn === 'white' && square.figure.type === 'king') {
                if (square.squareX === 2 && square.squareY === 7) {
                  // Move the left white rook
                  squaresXY[7][3].figure = squaresXY[7][0].figure
                  squaresXY[7][0].figure = null
                }
              }
              if (castlingWhiteRight && currentTurn === 'white' && square.figure.type === 'king') {
                if (square.squareX === 6 && square.squareY === 7) {
                  // Move the right white rook
                  squaresXY[7][5].figure = squaresXY[7][7].figure
                  squaresXY[7][7].figure = null
                }
              }
              if (castlingBlackLeft && currentTurn === 'black' && square.figure.type === 'king') {
                if (square.squareX === 2 && square.squareY === 0) {
                  // Move the left black rook
                  squaresXY[0][3].figure = squaresXY[0][0].figure
                  squaresXY[0][0].figure = null
                }
              }
              if (castlingBlackRight && currentTurn === 'black' && square.figure.type === 'king') {
                if (square.squareX === 6 && square.squareY === 0) {
                  // Move the right white rook
                  squaresXY[0][5].figure = squaresXY[0][7].figure
                  squaresXY[0][7].figure = null
                }
              }

              // Check if any castling related figures were moved
              updateCastlingState(square)

              // We check if the figure that was moved is a pawn and whether
              // it's at the edge of the board, so it can be promoted
              checkPawnPromotion(square)

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
    this.board = new P5(sketch, 'board')
  }
}
</script>
