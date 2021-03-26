import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import Web3 from 'web3';
import { song } from './abis';
import './App.css';
const web3 = new Web3(Web3.givenProvider);
const address_song = '0x004a84209A0021b8FF182FfD8BB874c53F65e90E'
const song_sc = new web3.eth.Contract(song, address_song);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
