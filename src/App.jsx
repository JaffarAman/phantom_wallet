import {
  ConnectionProvider,
  WalletProvider,
  useAnchorWallet,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import "./App.css";

function App() {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Content />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

const Content = () => {
  const [userSOLBalance, setSOLBalance] = useState(0);
  const wallet = useAnchorWallet();

  const network = WalletAdapterNetwork.Devnet;

  const connection = new Connection(clusterApiUrl(network));

  useEffect(() => {
    if (wallet?.publicKey) {
      const SOL = connection.getAccountInfo(wallet.publicKey);
      SOL.then((res) => {
        setSOLBalance(res && res.lamports / LAMPORTS_PER_SOL);
      });
    }
  }, [wallet?.publicKey]);

  return (
    <>
      {wallet ? (
        <WalletConnectedCmp userSOLBalance={userSOLBalance} />
      ) : (
        <div className="container">
          <section className="wallet_wrapper">
            <h1>Click here to connect Wallet</h1>
            <WalletMultiButton className="button" />
          </section>
        </div>
      )}
    </>
  );
};

const WalletConnectedCmp = ({ userSOLBalance }) => {
  return (
    <div className="container">
      <section className="connectedwallet_wrapper">
        <WalletMultiButton className="button" />
        <h1>Your Balance</h1>
        <div className="sol_balance">
          <h1>SOLANA:</h1>
          <button className="solbtn">{userSOLBalance || 0} Sol</button>
        </div>
      </section>
    </div>
  );
};

export default App;
