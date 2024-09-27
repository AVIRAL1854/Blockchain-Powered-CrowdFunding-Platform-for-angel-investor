"use client"
import React from 'react';
// import Dis from "@/Components/DiscoverWalletProviders"
import { DiscoverWalletProviders } from './DiscoverWalletProviders';

const ConnectWallet = ({ setAccount }) => {
  const handler = () => {
    console.log("this is the handler running");
    // listProviders();
  };
  return (
    <div>
      <DiscoverWalletProviders setAccount={setAccount} />
    </div>
  );
};

export default ConnectWallet
