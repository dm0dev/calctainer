import './app.css';
import { mount } from 'svelte';
import App from './App.svelte';
import { startPersistence } from './lib/state.svelte';

startPersistence();

export default mount(App, { target: document.getElementById('app')! });
