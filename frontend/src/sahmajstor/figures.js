import { ROWS, COLS } from './board.js'

export let figureImagePath = {
  pawnWhiteImagePath: 'figures/white/pawn.png',
  knightWhiteImagePath: 'figures/white/knight.png',
  bishopWhiteImagePath: 'figures/white/bishop.png',
  rookWhiteImagePath: 'figures/white/rook.png',
  queenWhiteImagePath: 'figures/white/queen.png',
  kingWhiteImagePath: 'figures/white/king.png',

  pawnBlackImagePath: 'figures/black/pawn.png',
  knightBlackImagePath: 'figures/black/knight.png',
  bishopBlackImagePath: 'figures/black/bishop.png',
  rookBlackImagePath: 'figures/black/rook.png',
  queenBlackImagePath: 'figures/black/queen.png',
  kingBlackImagePath: 'figures/black/king.png'
}

// Movesets for all figures
export function pawnMoves(x, y, player, board) {
  // The pawn has three different moves:
  // - move vertically
  // - move diagonally to the left
  // - move diagonally to the right
  let newXVert, newYVert
  let newXDiaLeft, newYDiaLeft
  let newXDiaRight, newYDiaRight
  let moves = []

  // Check whether we move up or down on the board, and then define all three
  // possible moves
  if (player === 'white') {
    newXVert = x
    newYVert = y - 1

    newXDiaLeft = x - 1
    newYDiaLeft = y - 1

    newXDiaRight = x + 1
    newYDiaRight = y - 1
  } else {
    newXVert = x
    newYVert = y + 1

    newXDiaLeft = x - 1
    newYDiaLeft = y + 1

    newXDiaRight = x + 1
    newYDiaRight = y + 1
  }

  // We add this move only if there are no figures in front of the pawn, and
  // we're not on the edge of the board
  if (newYVert < ROWS && newYVert >= 0 && !board[newYVert][newXVert].figure) {
    moves.push({x: newXVert, y: newYVert})
  }

  // Check if we can move diagonally
  if (newYDiaLeft < ROWS && newYDiaLeft >= 0 &&
    newXDiaLeft < COLS && newXDiaLeft >= 0 &&
    board[newYDiaLeft][newXDiaLeft].figure) {
    if (board[newYDiaLeft][newXDiaLeft].figure.player !== player)
      moves.push({x: newXDiaLeft, y: newYDiaLeft})
  }

  if (newYDiaRight < ROWS && newYDiaRight >= 0 &&
    newXDiaRight < COLS && newXDiaRight >= 0 &&
    board[newYDiaRight][newXDiaRight].figure) {
    if (board[newYDiaRight][newXDiaRight].figure.player !== player)
      moves.push({x: newXDiaRight, y: newYDiaRight})
  }

  return moves
}

export function knightMoves(x, y, player, board) {
  console.log(player)
  console.log(board)
  // Knight has eight possible moves, and he can jump over other figures
  let newX, newY
  let moves = []

  newX = x + 2
  newY = y + 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
  }

  newX = x + 2
  newY = y - 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
  }

  newX = x - 2
  newY = y + 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
  }

  newX = x - 2
  newY = y - 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
  }

  newX = x + 1
  newY = y + 2
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
  }

  newX = x + 1
  newY = y - 2
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
  }

  newX = x - 1
  newY = y + 2
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
  }

  newX = x - 1
  newY = y - 2
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
  }

  return moves
}

export function bishopMoves(x, y, player) {
  console.log(player)
  let newX, newY
  let moves = []

  newX = x + 1
  newY = y + 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
    newX += 1
    newY += 1
  }

  newX = x + 1
  newY = y - 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
    newX += 1
    newY -= 1
  }

  newX = x - 1
  newY = y + 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
    newX -= 1
    newY += 1
  }

  newX = x - 1
  newY = y - 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
    newX -= 1
    newY -= 1
  }

  return moves
}

export function rookMoves(x, y, player) {
  console.log(player)
  let newX, newY
  let moves = []

  newX = x
  newY = y
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
    newX += 1
  }

  newX = x
  newY = y
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
    newX -= 1
  }

  newX = x
  newY = y
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
    newY += 1
  }

  newX = x
  newY = y
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
    newY -= 1
  }

  return moves
}

export function queenMoves(x, y, player) {
  console.log(player)
  let newX, newY
  let moves = []

  newX = x + 1
  newY = y + 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
    newX += 1
    newY += 1
  }

  newX = x + 1
  newY = y - 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
    newX += 1
    newY -= 1
  }

  newX = x - 1
  newY = y + 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
    newX -= 1
    newY += 1
  }

  newX = x - 1
  newY = y - 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
    newX -= 1
    newY -= 1
  }

  newX = x
  newY = y
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
    newX += 1
  }

  newX = x
  newY = y
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
    newX -= 1
  }

  newX = x
  newY = y
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
    newY += 1
  }

  newX = x
  newY = y
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
    newY -= 1
  }

  return moves
}

export function kingMoves(x, y, player) {
  console.log(player)
  let newX, newY
  let moves = []

  newX = x
  newY = y + 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
  }

  newX = x
  newY = y - 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
  }

  newX = x + 1
  newY = y
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
  }

  newX = x - 1
  newY = y
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
  }

  newX = x + 1
  newY = y + 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
  }

  newX = x + 1
  newY = y - 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
  }

  newX = x - 1
  newY = y + 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
  }

  newX = x - 1
  newY = y - 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    moves.push({x: newX, y: newY})
  }

  return moves

}
