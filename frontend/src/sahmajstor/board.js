import P5 from 'p5'


const sketch = s => {

  function Square(x, y, fill) {
    // One square, which can hold one of the available figures

    // Size of square
    let squareSize = 60

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

    // Used to update display of this particular square
    this.display = function() {
      s.fill(this.fill)
      s.square(this.x, this.y, squareSize)
    }

    // Returns which squares the figure on this particular square is allowed to
    // move to
    this.getMoves = function() {

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

  let img;
  s.preload = () => {
    img = s.loadImage('pawn_white.png');
  }

  s.setup = () => {
    s.createCanvas(600, 600)

    // Draw chess board
    let currentIsWhite = true
    let fill = 225
    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        if (currentIsWhite) {
          fill = 255
        } else {
          fill = 0
        }
        let square = new Square(row, col, fill)
        square.display()
        squares.push(square)
        currentIsWhite = !currentIsWhite
      }
      currentIsWhite = !currentIsWhite
    }
    s.image(img, 0, 0);
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
