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
export function pawnMoves(x, y, player) {
  let newX, newY
  let moves = []
  if (player === 'white') {
    newX = x
    newY = y - 1
  } else {
    newX = x
    newY = y + 1
  }

  moves.push({x: newX, y: newY})

  return moves
}

export function knightMoves(x, y, player) {
  console.log(player)
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
