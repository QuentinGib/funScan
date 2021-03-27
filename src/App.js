import './App.css';
import React, { Component } from 'react';
import Web3 from 'web3';
import { song } from './abis/songabi';
import { toudou } from './abis/toudouabi';
const web3 = new Web3(Web3.givenProvider)
const address_song = '0x004a84209A0021b8FF182FfD8BB874c53F65e90E'
const song_sc = new web3.eth.Contract(song, address_song)
const address_toudou = '0x89150a0325ecc830a2304a44de98551051b4f466'
const toudou_sc = new web3.eth.Contract(toudou, address_toudou)

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
    this.displayTokens()
    this.owners()
  }

  async loadBlockchainData() {
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const chainID = await web3.eth.getChainId()
    this.setState({chainID})
    const lastBlock = await web3.eth.getBlockNumber()
    this.setState({lastBlock})
    const nftnumber = await song_sc.methods.tokenCounter().call()
    this.setState({nftnumber})
    const nftname = await song_sc.methods.name().call()
    this.setState({nftname})
    const nbOwnedSong = await song_sc.methods.balanceOf(this.state.account).call()
    this.setState({nbOwnedSong})
    const nbOwnedToudou = await toudou_sc.methods.balanceOf(this.state.account).call()
    this.setState({nbOwnedToudou})
  }

  async getTokenURI() {
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

  async displayTokens() {
    var maxid = await toudou_sc.methods.totalSupply().call()
    var owned = []
    for (let i = 0; i<maxid; i++) {
      if(await toudou_sc.methods.ownerOf(i).call()===this.state.account) {
        var token = await toudou_sc.methods.tokenByIndex(i).call()
        owned.push(token)
      }
    }
    this.setState({ownedToudou: owned})

    maxid = await song_sc.methods.totalSupply().call()
    owned = []
    for (let i = 0; i<maxid; i++) {
      if(await song_sc.methods.ownerOf(i).call()===this.state.account) {
        token = await song_sc.methods.tokenByIndex(i).call()
        owned.push(token)
      }
    }
    this.setState({ownedSong: owned})
  }

  transfer(contrat) {
    contrat.methods.safeTransferFrom(this.state.account, this.state.destination, this.state.formid).call()
    .once('receipt', (receipt) => {
      this.setState({ receipt })
    })
  }

  async owners() {
    var maxid = await toudou_sc.methods.totalSupply().call()
    var owned = []
    for (let i = 0; i<maxid; i++) {
      owned.push(await toudou_sc.methods.ownerOf(i).call())
    }
    console.log('ici')
    console.log(owned)
    this.setState({ownersOfToudou: owned})

    maxid = await song_sc.methods.totalSupply().call()
    owned = []
    for (let i = 0; i<maxid; i++) {
      owned.push(await song_sc.methods.ownerOf(i).call())
    }
    this.setState({ownersOfSong: owned})
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
      },
      nbOwnedSong: 0,
      nbOwnedToudou: 0,
      ownedToudou: [],
      ownedSong: [],
      receipt: false,
      formid: 0,
      destination: '',
      ownersOfSong: [],
      ownersOfToudou: []
    }
    this.transfer = this.transfer.bind(this)
  }

  render() {
    return (
      <div className="container">
        <h1>Trop bien ce site</h1>
        <p>Your account: {this.state.account}</p>
        <p>Chain id: {this.state.chainID}</p>
        <p>Last block: {this.state.lastBlock}</p>
        <p>Number of tokens: {this.state.nftnumber}</p>
        <p>Name of tokens: {this.state.nftname}</p>
        <p>Name of the token: {this.state.tokenURI.name}</p>
        <p>Description of the tokens: {this.state.tokenURI.description}</p>
        <img src={this.state.tokenURI.img} alt="new" style={{width:'50%'}}/>
        <button onClick={(event) => {
          event.preventDefault()
          song_sc.methods.claimAToken().send({ from: this.state.account })
        }}>Claim new token</button>
        <button onClick={(event) => {
          event.preventDefault()
          toudou_sc.methods.buyAToken().send({ from: this.state.account, value: 2*10**17 })
        }}>Buy a new tout doucement token</button>
        <p>You have {this.state.nbOwnedSong} song token with those IDs :</p>
        <div>
          {this.state.ownedSong.map(token => (
            <p>~ {token}</p>
          ))}
        </div>
        <p>You have {this.state.nbOwnedToudou} tout doucement token with those IDs:</p>
        <div>
          {this.state.ownedToudou.map(token => (
            <p>~ {token}</p>
          ))}
        </div>
        <form onSubmit={(event) => {
          event.preventDefault()
          this.transfer(song_sc)
        }}>
          <p>Transfer song token :</p>
          <input id="newID" ref={this.state.formid} type="number" className="form-control" placeholder="ID" required />
          <input id="newDestination" ref={this.destination} type="text" className="form-control" placeholder="Destination address" required />
          <input type="submit" />
        </form>
        <form onSubmit={(event) => {
          event.preventDefault()
          this.transfer(toudou_sc)
        }}>
          <p>Transfer Tout Doucement token :</p>
          <input id="newID" ref={this.state.formid} type="number" className="form-control" placeholder="ID" required />
          <input id="newDestination" ref={this.destination} type="text" className="form-control" placeholder="Destination address" required />
          <input type="submit" />
        </form>
        <p><br/>List of song token owners :</p>
        <div>
          {this.state.ownersOfSong.map(token => (
            <p>{token}</p>
          ))}
        </div>
        <p><br/>List of Tout doucement token owners :</p>
        <div>
          {this.state.ownersOfToudou.map(token => (
            <p>{token}</p>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
