import './App.css';
import React, { Component } from 'react';
import Web3 from 'web3';
import { song } from './abis';
const web3 = new Web3(Web3.givenProvider)

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData()
    this.getTokenURI()
    const ethEnabled = () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        return true;
      }
      return false;
    }
    ethEnabled()
  }

  async loadBlockchainData() {
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const chainID = await web3.eth.getChainId()
    this.setState({chainID})
    const lastBlock = await web3.eth.getBlockNumber()
    this.setState({lastBlock})
    const address_song = '0x004a84209A0021b8FF182FfD8BB874c53F65e90E'
    const song_sc = new web3.eth.Contract(song, address_song)
    const nftnumber = await song_sc.methods.tokenCounter().call()
    this.setState({nftnumber})
    const nftname = await song_sc.methods.name().call()
    this.setState({nftname})
  }

  async getTokenURI() {
    const address_song = '0x004a84209A0021b8FF182FfD8BB874c53F65e90E'
    const song_sc = new web3.eth.Contract(song, address_song)
    const uri = await song_sc.methods.tokenURI(0).call()
    fetch('https://cors-anywhere.herokuapp.com/'+uri, {
        method: "GET",
        headers: {
          "Content-Type": 'application/json',
          redirect: 'follow'
        }
    })
    .then(fetchResponse => {
      console.log(fetchResponse)
      return fetchResponse.json()
    })
    .then(responseData => {
      console.log(responseData)
      const name = responseData.properties.name.description
      const img = responseData.properties.image.description
      const description = responseData.properties.description.description
      this.setState({ tokenURI: {
        name,
        img,
        description
      }})
    })
  }


  constructor(props) {
    super(props)
    this.state = { 
      account: '',
      chainID: '',
      lastBlock: '',
      nftnumber: 0,
      nftname: '',
      tokenURI: {
        name: '',
        img: '',
        description: ''
      }
    }
  }

  render() {
    return (
      <div className="container">
        <h1>Hello, World!</h1>
        <p>Your account: {this.state.account}</p>
        <p>Chain id: {this.state.chainID}</p>
        <p>Last block: {this.state.lastBlock}</p>
        <p>Number of tokens: {this.state.nftnumber}</p>
        <p>Name of tokens: {this.state.nftname}</p>
        <p>Name of the token: {this.state.tokenURI.name}</p>
        <p>Description of the tokens: {this.state.tokenURI.description}</p>
        <image src={this.state.tokenURI.img} alt="new">Image of the token</image>
      </div>
    );
  }
}

export default App;
