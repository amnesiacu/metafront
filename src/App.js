/* global web3 */
import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';

class App extends Component {
    constructor(props) {
        super(props);

        if (typeof web3 !== 'undefined') {
            //Metamask
            window.web3 = new Web3(web3.currentProvider);
            console.log("Metamask used");
        } else {
            //No Metamask
            window.web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/token"));
        }

        this.state = {
            address: 'LOOKING UP ADDRESS'
        };
    }

    componentDidMount() {
        let component = this;
        window.web3.eth.getAccounts(function(error, accounts) {
            if (error){
                component.setAddress('Error in requesting address.');
            } else{
                if (!!accounts){
                    component.setAddress(accounts[0]);
                }
            }
        });
    }

    setAddress(account) {
        this.setState({
          address: account
        });
    }

    render() {
        console.log('Component Rendered');

        return (
            <div className="App">
              <p> Hello World </p>
              <h2>{this.state.address}</h2>
            </div>
        );
    }
}

export default App;
