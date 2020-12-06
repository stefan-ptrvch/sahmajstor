<template>
  <div id="board" />
</template>

<script>
import { createBoard } from '../sahmajstor/board.js'

export default {
  name: 'Home',
  created: function() {
    createBoard()
  }
}
</script>
