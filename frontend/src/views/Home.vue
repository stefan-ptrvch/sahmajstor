<template>
  <div id="canvas" />
</template>

<script>
import P5 from 'p5'


export default {
  name: 'Home',
  created: function() {
    const sketch = s => {

      function Square(x, y, fill) {

        let squareSize = 60
        this.x = x*squareSize
        this.y = y*squareSize
        this.fill = fill
        this.regularFill = fill
        this.clickedFill = s.color(255, 204, 0)

        this.display = function() {
            s.fill(this.fill)
            s.square(this.x, this.y, squareSize)
        }

        this.showMoves = function() {
          let d = s.dist(s.mouseX, s.mouseY, this.x + squareSize/2, this.y + squareSize/2)
          if (d < squareSize/2) {
            this.fill = this.clickedFill
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
          square.showMoves()
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

    let canvas = new P5(sketch, 'canvas');
    console.log(canvas)
  }
}
</script>
