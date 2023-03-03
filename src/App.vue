<template>
  <div id="app">
    <GooglePhotoSample />
  </div>
</template>

<script>
import GooglePhotoSample from './components/GooglePhotoSample.vue'

export default {
  name: 'App',
  components: {
    GooglePhotoSample
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
