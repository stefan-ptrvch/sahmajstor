<template>
  <div>
    <div id="board" />
      <input v-if="displayPromotionDialog">
    </div>
</template>

<script>
import { createBoard, pawnPromotion } from '../sahmajstor/board.js'

export default {
  name: 'PlakyChess',

  data() {
    return {
      board: null,
    }
  },

  computed: {
    displayPromotionDialog() {
      return pawnPromotion.dialog
    },

    figureType: {
      get() {
        return ''
      },

      set(newValue) {
        pawnPromotion.figureType = newValue
      }
    }
  },

  created: function() {
    this.board = createBoard()
  }
}
</script>

