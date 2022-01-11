use pyo3::prelude::*;
use std::collections::HashMap;

#[pyfunction]
fn get_next_move(board_description: Vec<HashMap<String, String>>) -> PyResult<String> {
    // Constructs a Board, finds the next move, and generates available moves
    // for the player
    let board = Board::new(&board_description);

    // Check whether we can generate some moves
    let moves = board.get_moves(1, 1);
    println!("{:?}", moves);

    Ok(String::from("WERKS!!!"))
}

/// A Python module implemented in Rust.
#[pymodule]
fn plakychess(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(get_next_move, m)?)?;
    Ok(())
}

const ROWS: usize = 8;
const COLS: usize = 8;

pub struct Board {
    board_state: [[Square; COLS]; ROWS]
}

impl Board {
    pub fn new(board_description: &Vec<HashMap<String, String>>) -> Self {
        let mut board_state = [[Square { x: 0, y: 0, content: SquareContent::EMPTY, belongs_to: PlayerName::NEITHER }; COLS]; ROWS];
        for square in board_description.iter() {
            let x = square.get("x").unwrap().parse::<usize>().unwrap();
            let y = square.get("y").unwrap().parse::<usize>().unwrap();
            board_state[y][x].x = x;
            board_state[y][x].y = y;
            match square.get("figure").unwrap().as_str() {
                "PAWN" => board_state[y][x].content = SquareContent::PAWN,
                "KNIGHT" => board_state[y][x].content = SquareContent::KNIGHT,
                "BISHOP" => board_state[y][x].content = SquareContent::BISHOP,
                "ROOK" => board_state[y][x].content = SquareContent::ROOK,
                "QUEEN" => board_state[y][x].content = SquareContent::QUEEN,
                "KING" => board_state[y][x].content = SquareContent::KING,
                "EMPTY" => board_state[y][x].content = SquareContent::EMPTY,
                x => panic!("Invalid figure type {:?}", x)
            }
            match square.get("belongs_to").unwrap().as_str() {
                "WHITE" => board_state[y][x].belongs_to = PlayerName::WHITE,
                "BLACK" => board_state[y][x].belongs_to = PlayerName::BLACK,
                "NEITHER" => board_state[y][x].belongs_to = PlayerName::NEITHER,
                x => panic!("Invalid player type {:?}", x)
            }
        }
        return Board { board_state }
    }

    pub fn get_moves(&self, x: usize, y: usize) -> Vec<(usize, usize)> {
        return self.board_state[y][x].get_moves(&self.board_state);
    }
}

#[derive(PartialEq, Copy, Clone)]
enum PlayerName {
    WHITE,
    BLACK,
    NEITHER
}

#[derive(PartialEq, Copy, Clone)]
enum SquareContent {
    PAWN,
    KNIGHT,
    BISHOP,
    ROOK,
    QUEEN,
    KING,
    EMPTY
}

#[derive(Copy, Clone)]
struct Square {
    x: usize,
    y: usize,
    content: SquareContent,
    belongs_to: PlayerName
}

impl Square {
    fn get_moves(&self, board_state: &[[Square; COLS]; ROWS]) -> Vec<(usize, usize)> {
        match self.content {
            SquareContent::PAWN => { return self.pawn_moves(&board_state) },
            SquareContent::KNIGHT => { return Vec::new() },
            SquareContent::BISHOP => { return Vec::new() },
            SquareContent::ROOK => { return Vec::new() },
            SquareContent::QUEEN => { return Vec::new() },
            SquareContent::KING => { return Vec::new() },
            SquareContent::EMPTY =>  { return Vec::new() }
        }
    }

    fn pawn_moves(&self, board_state: &[[Square; COLS]; ROWS]) -> Vec<(usize, usize)> {
        // The pawn has five different moves:
        // - move vertically
        // - move diagonally to the left
        // - move diagonally to the right
        // - additional square on first move
        // - en-passant move
        let (mut new_x_vert, mut new_y_vert) = (self.x, self.y);
        let (mut new_x_dia_left, mut new_y_dia_left) = (self.x, self.y);
        let (mut new_x_dia_right, mut new_y_dia_right) = (self.x, self.y);
        let (mut first_move_x, mut first_move_y) = (self.x, self.y);
        let mut moves = Vec::new();

        // Check whether we move up or down on the board, and then define all
        // three possible moves
        if self.belongs_to == PlayerName::WHITE {
          new_x_vert = self.x;
          new_y_vert = self.y - 1;

          first_move_x = new_x_vert;
          first_move_y = new_y_vert - 1;

          new_x_dia_left = self.x - 1;
          new_y_dia_left = self.y - 1;

          new_x_dia_right = self.x + 1;
          new_y_dia_right = self.y - 1;
        } else {
          new_x_vert = self.x;
          new_y_vert = self.y + 1;

          first_move_x = new_x_vert;
          first_move_y = new_y_vert + 1;

          new_x_dia_left = self.x - 1;
          new_y_dia_left = self.y + 1;

          new_x_dia_right = self.x + 1;
          new_y_dia_right = self.y + 1;
        }

        // We add this move only if there are no figures in front of the pawn,
        // and we're not on the edge of the board
        if new_y_vert < ROWS && new_y_vert >= 0 && board_state[new_y_vert][new_x_vert].content == SquareContent::EMPTY {
          moves.push((new_x_vert, new_y_vert));

          // If it's the first move of a pawn, a pawn gets to move an additional square
          // I threw this check inside the above check because if there's a
          // figure directly in front of the pawn, this move is not valid
          if ((self.belongs_to == PlayerName::WHITE && self.y == COLS - 2) || (self.belongs_to == PlayerName::BLACK && self.y == 1)) && board_state[first_move_y][first_move_x].content == SquareContent::EMPTY {
            moves.push((first_move_x, first_move_y));
          }
        }

        // Check if we can move diagonally
        if new_y_dia_left < ROWS && new_y_dia_left >= 0 && new_x_dia_left < COLS && new_x_dia_left >= 0 && board_state[new_y_dia_left][new_x_dia_left].content != SquareContent::EMPTY {
          if board_state[new_y_dia_left][new_x_dia_left].belongs_to != self.belongs_to {
            moves.push((new_x_dia_left, new_y_dia_left));
          }
        }

        if new_y_dia_right < ROWS && new_y_dia_right >= 0 && new_x_dia_right < COLS && new_x_dia_right >= 0 && board_state[new_y_dia_right][new_x_dia_right].content != SquareContent::EMPTY {
          if board_state[new_y_dia_right][new_x_dia_right].belongs_to != self.belongs_to {
            moves.push((new_x_dia_right, new_y_dia_right));
          }
        }

        // Check if en-passant moves are available
        // if (player === 'white' && y === 3) {
          // let enPassantLeft = x - 1
          // let enPassantRight = x + 1
          // if (enPassantLeft >= 0 && enPassant['black'][enPassantLeft]) {
            // moves.push({x: enPassantLeft, y: y -  1})
          // }
          // if (enPassantRight < COLS && enPassant['black'][enPassantRight]) {
            // moves.push({x: enPassantRight, y: y -  1})
          // }
        // } else if (player === 'black' && y === 4) {
          // let enPassantLeft = x - 1
          // let enPassantRight = x + 1
          // if (enPassantLeft >= 0 && enPassant['white'][enPassantLeft]) {
            // moves.push({x: enPassantLeft, y: y +  1})
          // }
          // if (enPassantRight < COLS && enPassant['white'][enPassantRight]) {
            // moves.push({x: enPassantRight, y: y +  1})
          // }
        // }

        return moves
    }
}
