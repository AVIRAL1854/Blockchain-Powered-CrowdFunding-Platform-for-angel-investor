import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";


const DEFAULT_NAME="SuperToken";
const DEFAULT_SYMBOL="STK";
const DEFAULT_INITIAL_SUPPLY=1_000_000;
const DEFAULT_DECIMALS=18;

const SuperTokenModule= buildModule("SuperTokenModule",(m)=>{
    const name=m.getParameter("name", DEFAULT_NAME);
    const symbol=m.getParameter("symbol",DEFAULT_SYMBOL);
    const initialSupply=m.getParameter("initialSupply", DEFAULT_INITIAL_SUPPLY);
    const decimals=m.getParameter("decimals", DEFAULT_DECIMALS);

    const superToken=m.contract("SuperToken",[name, symbol,initialSupply, decimals]);

    console.log("this is the token address:"+ superToken.getAddress());
    // the token address is same as contract address
    return {superToken};

})

export default SuperTokenModule;