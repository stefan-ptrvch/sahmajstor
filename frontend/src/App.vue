<template>
  <v-app>
    <v-main>
      <home />
    </v-main>
  </v-app>
</template>

<script>
import Home from './views/Home'

export default {
  name: 'App',

  components: {
    Home,
  }
}
</script>
