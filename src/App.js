import './App.css';
import React, { Component } from 'react';
import Web3 from 'web3';
import { song } from './abis/songabi';
import { toudou } from './abis/toudouabi';
import { title } from 'process';
const web3 = new Web3(Web3.givenProvider)
const address_song = '0x004a84209A0021b8FF182FfD8BB874c53F65e90E'
const song_sc = new web3.eth.Contract(song, address_song)
const address_toudou = '0x89150a0325ecc830a2304a44de98551051b4f466'
const toudou_sc = new web3.eth.Contract(toudou, address_toudou)
const url = require('url');

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
    console.log(window.location.href.split("=")[1])
    const accounts =  window.location.href.split("=")[1] || await web3.eth.getAccounts()
    this.setState({ account: accounts })
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
    contrat.methods.safeTransferFrom(this.state.account,this.state.destination,this.state.formid).send({from:this.state.account,to:this.state.destination,tokenId:this.state.formid})
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
    this.handleInputChange=this.handleInputChange.bind(this)
  }
  handleInputChange(event) {
    const target = event.target;    
    console.log(target.value)
    console.log(target.name)
    this.setState({[target.name]: target.value})
  }
  
  render() {
    const titleStyle = {
      marginLeft:'5px',
      color: '#02859F',
      fontSize: '30px',
      fontWeight: "bold",
    };
     const elementStyle={
       marginLeft:'10px'
     }
    return (
      <div className="container">
        <h1 style={{fontSize:'70px',marginLeft:'-10px'}}>Trop bien ce site</h1>
        <p style = {{borderRadius: 10,boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"}}><div style={titleStyle}>Your account: </div> <div style={elementStyle}>{this.state.account}</div></p>
        <p style = {{borderRadius: 10,boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"}}><div style={titleStyle}>Chain id: </div><div style={elementStyle}>{this.state.chainID}</div></p>
        <p style = {{borderRadius: 10,boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"}}><div style={titleStyle}>Last block:  </div><div style={elementStyle}>{this.state.lastBlock}</div></p>
        <p style = {{borderRadius: 10,boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"}}><div style={titleStyle}>Number of tokens: </div> <div style={elementStyle}>{this.state.nftnumber}</div></p>
        <p style = {{borderRadius: 10,boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"}}><div style={titleStyle}>Name of tokens:  </div><div style={elementStyle}>{this.state.nftname}</div></p>
        <p style = {{borderRadius: 10,boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"}}><div style={titleStyle}>Name of the token:  </div><div style={elementStyle}>{this.state.tokenURI.name}</div></p>
        <p style = {{borderRadius: 10,boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"}}><div style={titleStyle}>Description of the tokens:  </div><div style={elementStyle}>{this.state.tokenURI.description}</div></p>
        <img src={this.state.tokenURI.img} alt="new" style={{width:'50%'}}/>
        <button onClick={(event) => {
          event.preventDefault()
          song_sc.methods.claimAToken().send({ from: this.state.account })
        }}>Claim new token</button>
        <button onClick={(event) => {
          event.preventDefault()
          toudou_sc.methods.buyAToken().send({ from: this.state.account, value: 2*10**17 })
        }}>Buy a new tout doucement token</button>
        <p><div style={titleStyle,{borderRadius: 10,boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"}}>You have </div><div style={{textDecorationLine: 'underline'}}> {this.state.nbOwnedSong} song token with those IDs : </div> </p>
        <div>
          {this.state.ownedSong.map(token => (
            <p>~ {token}</p>
          ))}
        </div>
        <p><div style={titleStyle,{borderRadius: 10,boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"}}>and </div><div style={{textDecorationLine: 'underline'}}>{this.state.nbOwnedToudou} tout doucement token with those IDs:</div></p>
        <div>
          {this.state.ownedToudou.map(token => (
            <p>~ {token}</p>
          ))}
        </div>
        
        <form onSubmit={(event) => {
          event.preventDefault()
          this.transfer(song_sc)
        }}>
          <div style = {{borderRadius: 10,boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"}}><div style={titleStyle}>Transfer song token :</div> 
          <input id="newID" ref={this.state.formid} name="formid" type="number" className="form-control" onChange={this.handleInputChange} placeholder="ID" required />
          <input id="destination" ref={this.state.destination} name="destination" type="text" className="form-control" onChange={this.handleInputChange} placeholder="Destination address" required />
          <input type="submit" />
          </div>
        </form>
        <form onSubmit={(event) => {
          event.preventDefault()
          this.transfer(toudou_sc)
        }}>
          <div style = {{borderRadius: 10,boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",marginLeft:'5px',
      color: '#02859F',}}><div style={titleStyle}>Transfer Tout Doucement token :</div>
          <input id="newID" ref={this.state.formid} type="number" className="form-control" onChange={this.handleInputChange} placeholder="ID" required />
          <input id="newDestination" ref={this.state.destination} type="text" className="form-control" onChange={this.handleInputChange} placeholder="Destination address" required />
          <input type="submit" /></div>
      </form>
        <div style = {{borderRadius: 10,boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",marginLeft:'10px'}}>
        <div style={titleStyle}> List of song token owners :</div>
        <div style={{marginLeft:'20px'}}>
          {this.state.ownersOfSong.map(token => (
            <p>{token}</p>
          ))}
        </div>
        </div>
        <div style={{borderRadius: 10,boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",marginLeft:'10px'}}>
          <div style = {titleStyle}>List of Tout doucement token owners :</div>
          <div style={{marginLeft:'20px'}}>
            {this.state.ownersOfToudou.map(token => (
              <p>{token}</p>
            ))}
          </div>
        </div>
        </div>
    );
  }
}

export default App;
