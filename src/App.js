/* global web3 */
import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import abi from 'human-standard-token-abi';


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
            address: 'LOOKING UP ADDRESS',
            balance: 'BALANCE'
        };
    }

    componentDidMount() {
        let component = this;
        window.web3.eth.getAccounts(function(error, accounts) {
            if (error){
                component.setAddress('Error in requesting address.');
            } else{
                if (!!accounts){
                    let address = accounts[0]
                    let address_sub = address.substr(2, address.length -2);
                    component.setAddress(address);
                    console.log('addressFound', address);
                    console.log('addressFound', address_sub);
                    window.web3.eth.getBalance(address, (err, balance) => {
                        component.setBalance(`0.${balance.toString(10)} ETH`);
                    });

                    window.web3.eth.contract(abi).at("0xe41d2489571d322189246dafa5ebde1f4699f498", (err, token)=> {
                        console.log(err, token);
                        token.name.call({},(err, resp)=>{
                            console.log(err, resp);
                        });

                        token.decimals.call({}, (err, resp)=>{
                            let decimals = parseInt(resp.toString(10), 10);

                            token.balanceOf.call(address, (err, resp)=>{
                                let balance = resp.toString(10);
                                let int = balance.substr(0, balance.length - decimals);
                                let dec = balance.substr(int.length, decimals);
                                console.log(`${int}.${dec}`);
                            });
                        });
                    });



                    // let funcSelector = window.web3.sha3('balanceOf(address)').slice(0,10);
                    // console.log(funcSelector);
                    // window.web3.eth.call({  to: "0xe41d2489571d322189246dafa5ebde1f4699f498", data: `${funcSelector}000000000000000000000000${address_sub}` }, (err, balance) => {
                    //     console.log(err, balance);
                    // });
                }
            }
        });
    }

    setBalance(balance){
        this.setState({
            balance: balance
        })
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
              <h2>{this.state.address}</h2>
              <p>Balance: <b>{this.state.balance}</b></p>
            </div>
        );
    }
}

export default App;
