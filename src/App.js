import React, { Component } from 'react';
import web3 from './web3';
import lotteryContract from './lotteryContract';

class App extends Component {
  state = {
    value: '',
    manager: '',
    players: [],
    balance: '',
    message: ''
  }

  async componentDidMount() {
    this.setState({ 
      manager: await lotteryContract.methods.manager().call(),
      players: await lotteryContract.methods.getPlayers().call(),
      balance: await web3.eth.getBalance(lotteryContract.options.address)
    });
  }

  onSubmitEnterForm = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    
    this.setState({ message: 'Waiting on transaction success...' });

    await lotteryContract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });
  }

  onPickWinnerButton = async () => {
    const accounts = await web3.eth.getAccounts();
    
    this.setState({ message: 'Waiting on transaction success...' });

    await lotteryContract.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner as been picked!' });
    
  }

  renderPickerWinner() {
    return (
      <div>
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onPickWinnerButton}>
          Pick a winner!
        </button>
        <hr/>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>Current number of players: {this.state.players.length}</p>
        <p>Current contract balance: {web3.utils.fromWei(this.state.balance, 'ether')} ether!</p>
        <hr />
        <form onSubmit={this.onSubmitEnterForm}>
          <h4>Want to try your luck?</h4>
          <label>
            <span>Amount of ether to enter:</span>&nbsp;
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />&nbsp;
            <button>Enter</button>
          </label>
        </form>
        <hr/>
        
        {this.renderPickerWinner()}

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
