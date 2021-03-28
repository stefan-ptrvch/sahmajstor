import { ROWS, COLS } from './settings.js'
import {
  castlingWhiteLeft,
  castlingWhiteRight,
  castlingBlackLeft,
  castlingBlackRight,
  enPassant
} from './PlakyChess.vue'

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
  // The pawn has five different moves:
  // - move vertically
  // - move diagonally to the left
  // - move diagonally to the right
  // - additional square on first move
  // - en-passant move
  let newXVert, newYVert
  let newXDiaLeft, newYDiaLeft
  let newXDiaRight, newYDiaRight
  let firstMoveX, firstMoveY
  let moves = []

  // Check whether we move up or down on the board, and then define all three
  // possible moves
  if (player === 'white') {
    newXVert = x
    newYVert = y - 1

    firstMoveX = newXVert
    firstMoveY = newYVert - 1

    newXDiaLeft = x - 1
    newYDiaLeft = y - 1

    newXDiaRight = x + 1
    newYDiaRight = y - 1
  } else {
    newXVert = x
    newYVert = y + 1

    firstMoveX = newXVert
    firstMoveY = newYVert + 1

    newXDiaLeft = x - 1
    newYDiaLeft = y + 1

    newXDiaRight = x + 1
    newYDiaRight = y + 1
  }

  // We add this move only if there are no figures in front of the pawn, and
  // we're not on the edge of the board
  if (newYVert < ROWS && newYVert >= 0 && !board[newYVert][newXVert].figure) {
    moves.push({x: newXVert, y: newYVert})

    // If it's the first move of a pawn, a pawn gets to move an additional square
    // I threw this check inside the above check because if there's a figure
    // directly in front of the pawn, this move is not valid
    if (((player === 'white' && y === COLS - 2) || (player === 'black' && y === 1)) && !board[firstMoveY][firstMoveX].figure) {
      moves.push({x: firstMoveX, y: firstMoveY})
    }
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

  // Check if en-passant moves are available
  if (player === 'white' && y === 3) {
    let enPassantLeft = x - 1
    let enPassantRight = x + 1
    if (enPassantLeft >= 0 && enPassant['black'][enPassantLeft]) {
      moves.push({x: enPassantLeft, y: y -  1})
    }
    if (enPassantRight < COLS && enPassant['black'][enPassantRight]) {
      moves.push({x: enPassantRight, y: y -  1})
    }
  } else if (player === 'black' && y === 4) {
    let enPassantLeft = x - 1
    let enPassantRight = x + 1
    if (enPassantLeft >= 0 && enPassant['white'][enPassantLeft]) {
      moves.push({x: enPassantLeft, y: y +  1})
    }
    if (enPassantRight < COLS && enPassant['white'][enPassantRight]) {
      moves.push({x: enPassantRight, y: y +  1})
    }
  }

  return moves
}

export function knightMoves(x, y, player, board) {
  // Knight has eight possible moves, and he can jump over other figures
  let newX, newY
  let moves = []

  newX = x + 2
  newY = y + 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    // We add this move to the list if the square is empty or contains a figure
    // of the opponent
    if(!board[newY][newX].figure || board[newY][newX].figure.player !== player)
      moves.push({x: newX, y: newY})
  }

  newX = x + 2
  newY = y - 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    if(!board[newY][newX].figure || board[newY][newX].figure.player !== player)
      moves.push({x: newX, y: newY})
  }

  newX = x - 2
  newY = y + 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    if(!board[newY][newX].figure || board[newY][newX].figure.player !== player)
      moves.push({x: newX, y: newY})
  }

  newX = x - 2
  newY = y - 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    if(!board[newY][newX].figure || board[newY][newX].figure.player !== player)
      moves.push({x: newX, y: newY})
  }

  newX = x + 1
  newY = y + 2
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    if(!board[newY][newX].figure || board[newY][newX].figure.player !== player)
      moves.push({x: newX, y: newY})
  }

  newX = x + 1
  newY = y - 2
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    if(!board[newY][newX].figure || board[newY][newX].figure.player !== player)
      moves.push({x: newX, y: newY})
  }

  newX = x - 1
  newY = y + 2
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    if(!board[newY][newX].figure || board[newY][newX].figure.player !== player)
      moves.push({x: newX, y: newY})
  }

  newX = x - 1
  newY = y - 2
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    if(!board[newY][newX].figure || board[newY][newX].figure.player !== player)
      moves.push({x: newX, y: newY})
  }

  return moves
}

export function bishopMoves(x, y, player, board) {
  // The bishop has four possible move types
  let newX, newY
  let moves = []

  newX = x + 1
  newY = y + 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    // If there's a figure in this square, and if it's the opponent's figure,
    // we add this move to the moves list, else we just break
    if (!board[newY][newX].figure) {
      moves.push({x: newX, y: newY})
    } else if (board[newY][newX].figure.player !== player) {
      moves.push({x: newX, y: newY})
      break
    } else {
      break
    }

    newX += 1
    newY += 1
  }

  newX = x + 1
  newY = y - 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    // If there's a figure in this square, and if it's the opponent's figure,
    // we add this move to the moves list, else we just break
    if (!board[newY][newX].figure) {
      moves.push({x: newX, y: newY})
    } else if (board[newY][newX].figure.player !== player) {
      moves.push({x: newX, y: newY})
      break
    } else {
      break
    }

    newX += 1
    newY -= 1
  }

  newX = x - 1
  newY = y + 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    // If there's a figure in this square, and if it's the opponent's figure,
    // we add this move to the moves list, else we just break
    if (!board[newY][newX].figure) {
      moves.push({x: newX, y: newY})
    } else if (board[newY][newX].figure.player !== player) {
      moves.push({x: newX, y: newY})
      break
    } else {
      break
    }

    newX -= 1
    newY += 1
  }

  newX = x - 1
  newY = y - 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    // If there's a figure in this square, and if it's the opponent's figure,
    // we add this move to the moves list, else we just break
    if (!board[newY][newX].figure) {
      moves.push({x: newX, y: newY})
    } else if (board[newY][newX].figure.player !== player) {
      moves.push({x: newX, y: newY})
      break
    } else {
      break
    }

    newX -= 1
    newY -= 1
  }

  return moves
}

export function rookMoves(x, y, player, board) {
  // The rook has four possible move types
  let newX, newY
  let moves = []

  newX = x + 1
  newY = y
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    // If there's a figure in this square, and if it's the opponent's figure,
    // we add this move to the moves list, else we just break
    if (!board[newY][newX].figure) {
      moves.push({x: newX, y: newY})
    } else if (board[newY][newX].figure.player !== player) {
      moves.push({x: newX, y: newY})
      break
    } else {
      break
    }

    newX += 1
  }

  newX = x - 1
  newY = y
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    // If there's a figure in this square, and if it's the opponent's figure,
    // we add this move to the moves list, else we just break
    if (!board[newY][newX].figure) {
      moves.push({x: newX, y: newY})
    } else if (board[newY][newX].figure.player !== player) {
      moves.push({x: newX, y: newY})
      break
    } else {
      break
    }

    newX -= 1
  }

  newX = x
  newY = y + 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    // If there's a figure in this square, and if it's the opponent's figure,
    // we add this move to the moves list, else we just break
    if (!board[newY][newX].figure) {
      moves.push({x: newX, y: newY})
    } else if (board[newY][newX].figure.player !== player) {
      moves.push({x: newX, y: newY})
      break
    } else {
      break
    }

    newY += 1
  }

  newX = x
  newY = y - 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    // If there's a figure in this square, and if it's the opponent's figure,
    // we add this move to the moves list, else we just break
    if (!board[newY][newX].figure) {
      moves.push({x: newX, y: newY})
    } else if (board[newY][newX].figure.player !== player) {
      moves.push({x: newX, y: newY})
      break
    } else {
      break
    }

    newY -= 1
  }

  return moves
}

export function queenMoves(x, y, player, board) {
  // The queen has four possible move types
  let newX, newY
  let moves = []

  newX = x + 1
  newY = y + 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    // If there's a figure in this square, and if it's the opponent's figure,
    // we add this move to the moves list, else we just break
    if (!board[newY][newX].figure) {
      moves.push({x: newX, y: newY})
    } else if (board[newY][newX].figure.player !== player) {
      moves.push({x: newX, y: newY})
      break
    } else {
      break
    }

    newX += 1
    newY += 1
  }

  newX = x + 1
  newY = y - 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    // If there's a figure in this square, and if it's the opponent's figure,
    // we add this move to the moves list, else we just break
    if (!board[newY][newX].figure) {
      moves.push({x: newX, y: newY})
    } else if (board[newY][newX].figure.player !== player) {
      moves.push({x: newX, y: newY})
      break
    } else {
      break
    }

    newX += 1
    newY -= 1
  }

  newX = x - 1
  newY = y + 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    // If there's a figure in this square, and if it's the opponent's figure,
    // we add this move to the moves list, else we just break
    if (!board[newY][newX].figure) {
      moves.push({x: newX, y: newY})
    } else if (board[newY][newX].figure.player !== player) {
      moves.push({x: newX, y: newY})
      break
    } else {
      break
    }

    newX -= 1
    newY += 1
  }

  newX = x - 1
  newY = y - 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    // If there's a figure in this square, and if it's the opponent's figure,
    // we add this move to the moves list, else we just break
    if (!board[newY][newX].figure) {
      moves.push({x: newX, y: newY})
    } else if (board[newY][newX].figure.player !== player) {
      moves.push({x: newX, y: newY})
      break
    } else {
      break
    }

    newX -= 1
    newY -= 1
  }

  newX = x + 1
  newY = y
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    // If there's a figure in this square, and if it's the opponent's figure,
    // we add this move to the moves list, else we just break
    if (!board[newY][newX].figure) {
      moves.push({x: newX, y: newY})
    } else if (board[newY][newX].figure.player !== player) {
      moves.push({x: newX, y: newY})
      break
    } else {
      break
    }

    newX += 1
  }

  newX = x - 1
  newY = y
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    // If there's a figure in this square, and if it's the opponent's figure,
    // we add this move to the moves list, else we just break
    if (!board[newY][newX].figure) {
      moves.push({x: newX, y: newY})
    } else if (board[newY][newX].figure.player !== player) {
      moves.push({x: newX, y: newY})
      break
    } else {
      break
    }

    newX -= 1
  }

  newX = x
  newY = y + 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    // If there's a figure in this square, and if it's the opponent's figure,
    // we add this move to the moves list, else we just break
    if (!board[newY][newX].figure) {
      moves.push({x: newX, y: newY})
    } else if (board[newY][newX].figure.player !== player) {
      moves.push({x: newX, y: newY})
      break
    } else {
      break
    }

    newY += 1
  }

  newX = x
  newY = y - 1
  while (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    // If there's a figure in this square, and if it's the opponent's figure,
    // we add this move to the moves list, else we just break
    if (!board[newY][newX].figure) {
      moves.push({x: newX, y: newY})
    } else if (board[newY][newX].figure.player !== player) {
      moves.push({x: newX, y: newY})
      break
    } else {
      break
    }

    newY -= 1
  }

  return moves
}

export function kingMoves(x, y, player, board) {
  // The king has eight normal moves and two castling moves
  let newX, newY
  let moves = []

  newX = x
  newY = y + 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    if (!board[newY][newX].figure || board[newY][newX].figure.player !== player)
      moves.push({x: newX, y: newY})
  }

  newX = x
  newY = y - 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    if (!board[newY][newX].figure || board[newY][newX].figure.player !== player)
      moves.push({x: newX, y: newY})
  }

  newX = x + 1
  newY = y
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    if (!board[newY][newX].figure || board[newY][newX].figure.player !== player)
      moves.push({x: newX, y: newY})
  }

  newX = x - 1
  newY = y
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    if (!board[newY][newX].figure || board[newY][newX].figure.player !== player)
      moves.push({x: newX, y: newY})
  }

  newX = x + 1
  newY = y + 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    if (!board[newY][newX].figure || board[newY][newX].figure.player !== player)
      moves.push({x: newX, y: newY})
  }

  newX = x + 1
  newY = y - 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    if (!board[newY][newX].figure || board[newY][newX].figure.player !== player)
      moves.push({x: newX, y: newY})
  }

  newX = x - 1
  newY = y + 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    if (!board[newY][newX].figure || board[newY][newX].figure.player !== player)
      moves.push({x: newX, y: newY})
  }

  newX = x - 1
  newY = y - 1
  if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
    if (!board[newY][newX].figure || board[newY][newX].figure.player !== player)
      moves.push({x: newX, y: newY})
  }

  // Now we check for castling related moves
  if (player === 'white' && castlingWhiteLeft) {
    // Check if there are any figures blocking the way
    if (!board[7][2].figure && !board[7][3].figure) {

      // Check if any of the fields the king is moving over are under attack
      if (!isUnderAttack('black', [{y: 7, x: 2}, {y: 7, x: 3}], board)) {
        moves.push({x: 2, y: 7})
      }
    }
  }
  if (player === 'white' && castlingWhiteRight) {
    // Check if there are any figures blocking the way
    if (!board[7][5].figure && !board[7][6].figure) {

      // Check if any of the fields the king is moving over are under attack
      if (!isUnderAttack('black', [{y: 7, x: 5}, {y: 7, x: 6}], board)) {
        moves.push({x: 6, y: 7})
      }
    }
  }
  if (player === 'black' && castlingBlackLeft) {
    // Check if there are any figures blocking the way
    if (!board[0][2].figure && !board[0][3].figure) {

      // Check if any of the fields the king is moving over are under attack
      if (!isUnderAttack('white', [{y: 0, x: 2}, {y: 0, x: 3}], board)) {
        moves.push({x: 2, y: 0})
      }
    }
  }
  if (player === 'black' && castlingBlackRight) {
    // Check if there are any figures blocking the way
    if (!board[0][5].figure && !board[0][6].figure) {

      // Check if any of the fields the king is moving over are under attack
      if (!isUnderAttack('white', [{y: 0, x: 5}, {y: 0, x: 6}], board)) {
        moves.push({x: 6, y: 0})
      }
    }
  }

  return moves
}

// Checks if `squares` are under attack by any figures by `player`
function isUnderAttack(player, squares, board) {
  for (let row of board) {
    for (let square of row) {
      // We're only interested in opponent's figures
      // We also skip the king since we'll get into infinite recursion if both
      // kings have castling checks
      if (!square.figure || square.figure.type === 'king' || square.figure.player !== player) {
        continue
      } else {
        // We take the available moves of the opponents figure, and check if
        // the fields of interest are among the available moves
        let opponentMoves = square.getMoves(board)
        for (let move of opponentMoves) {
          for (let squareUnderTest of squares) {
            if (move.x === squareUnderTest.x && move.y === squareUnderTest.y) {
              return true
            }
          }
        }
      }
    }
  }
  return false
}
