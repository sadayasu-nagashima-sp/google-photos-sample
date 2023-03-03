import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import GAuth from 'vue-google-oauth2'
const gauthOption = {
  clientId: '203585822374-ru4c3q6kdtfpb20ofno4j52t5u45293s.apps.googleusercontent.com',
  scope: 'https://www.googleapis.com/auth/photoslibrary.readonly',
  prompt: 'select_account',
  plugin_name:'App Name that you used in google developer console API'
}
Vue.use(GAuth, gauthOption)

new Vue({
  render: h => h(App),
}).$mount('#app')
