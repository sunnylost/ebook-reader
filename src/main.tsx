import 'solid-devtools'
import { render } from 'solid-js/web'
import './assets/global.css'
import App from './App'

render(() => <App />, document.getElementById('app') || document.body)
