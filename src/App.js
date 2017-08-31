/* global web3 */
import React, {Component} from 'react';
import './App.css';
import Web3 from 'web3';
import abi from 'human-standard-token-abi';


class App extends Component {
    constructor(props) {
        super(props);

        if (typeof web3 !== 'undefined') {
            // console.log('Metamask used');
            window.web3 = new Web3(web3.currentProvider);
        } else {
            this.setState('error', 'NO METAMASK');
        }

        this.state = {
            address: 'LOOKING UP ADDRESS',
            ethBalance: '[ETH] BALANCE',
            zrxBalance: '[ZRX] BALANCE'
        };
    }

    componentDidMount() {
        let component = this;
        window.web3.eth.getAccounts(function(error, accounts) {
            if (error){
                component.setAddress('Error in requesting address.');
            } else {
                if (!!accounts) {
                    let address = accounts[0];
                    component.setAddress(address);
                    window.web3.eth.getBalance(address, (err, balance) => {
                        component.setBalance(`0.${balance.toString(10)} ETH`);
                    });

                    //0x Contract address hardcoded, shouldnt be doing that
                    window.web3.eth.contract(abi).at('0xe41d2489571d322189246dafa5ebde1f4699f498', (err, token)=> {
                        token.decimals.call({}, (err, resp)=>{
                            let decimals = parseInt(resp.toString(10), 10);

                            token.balanceOf.call(address, (err, resp)=>{
                                let balance = resp.toString(10);
                                let int = balance.substr(0, balance.length - decimals);
                                let dec = balance.substr(int.length, decimals);
                                let zrxBalance = `${int}.${dec} ZRX`;
                                component.set0xBalance(zrxBalance);
                            });
                        });
                    });
                }
            }
        });
    }

    setBalance(balance){
        this.setState({
            ethBalance: balance
        });
    }

    set0xBalance(balance){
        this.setState({
            zrxBalance: balance
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
                <h2>{this.state.address}</h2>
                <p>
                    <b>{this.state.ethBalance}</b>
                </p>
                <p>
                    <b>{this.state.zrxBalance}</b>
                </p>
            </div>
        );
    }
}

export default App;
