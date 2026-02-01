import './assets/main.css'

import { createApp } from 'vue'
import App from '../components/App.vue'
import router from './router'
import { createTonConnectUIProvider, TonConnectUIContext, TonConnectUIOptionsContext } from 'ton-ui-vue';

const { tonConnectUI, setOptions } = createTonConnectUIProvider({
  manifestUrl: 'https://your-app-url.com/tonconnect-manifest.json'
});

const app = createApp(App)
app.provide(TonConnectUIContext, tonConnectUI);
app.provide(TonConnectUIOptionsContext, setOptions);
app.use(router)
app.mount('#app')
