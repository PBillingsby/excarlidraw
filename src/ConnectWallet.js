import { WebBundlr } from '@bundlr-network/client';
import { useContext, useEffect, useState } from "react";
import { ethers, formatEther } from 'ethers';

import { UserContext } from "./context";

export const ConnectWallet = () => {
  const { bundlrInstance, setBundlrInstance, isOpen } = useContext(UserContext)
  const [balance, setBalance] = useState();
  const [fund, setFund] = useState(false);

  const getBalance = async () => {
    if (!bundlrInstance) {
      return;
    }
    const balance = await bundlrInstance.getLoadedBalance();
    // const formatted = formatEther(balance.toString()).slice(0, 5)
    setBalance(formatEther(balance.toString()).slice(0, 5));
  }

  useEffect(() => {
    getBalance()
  }, [bundlrInstance])

  const handleConnect = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    provider.getSigner = () => signer;

    const bundlr = new WebBundlr("https://node1.bundlr.network", "matic", provider);
    await bundlr.ready();

    setBundlrInstance(bundlr);
  };

  const signOut = () => {
    setBundlrInstance(null);
  }

  return (
    <div className={`${isOpen && 'blur-sm'} flex justify-between p-4`}>
      <h1 className="text-2xl flex">excARlidraw<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brush" width="18" height="18" viewBox="0 0 24 24" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 21v-4a4 4 0 1 1 4 4h-4"></path><path d="M21 3a16 16 0 0 0 -12.8 10.2"></path><path d="M21 3a16 16 0 0 1 -10.2 12.8"></path><path d="M10.6 9a9 9 0 0 1 4.4 4.4"></path></svg></h1>
      <div>
        <button
          onClick={bundlrInstance ? signOut : handleConnect}
          className="px-5 py-2 bg-gray-500 hover:bg-gray-700 text-white cursor-pointer rounded-md">
          {bundlrInstance ?
            <div>
              {`${bundlrInstance.address.slice(0, 6)}...${bundlrInstance.address.slice(bundlrInstance.address.length - 6)}`}</div>
            :
            <p>Connect Wallet</p>
          }
        </button>
        {balance &&
          <span className="flex max-w-[15vw] gap-2 text-center">
            <p>Bal: {balance} {bundlrInstance.currency}</p>
            {fund ?
              <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setFund(!fund)} className="icon icon-tabler icon-tabler-x mt-1" width="16" height="16" viewBox="0 0 24 24" stroke="red" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setFund(!fund)} className="icon icon-tabler icon-tabler-plus mt-1" width="16" height="16" viewBox="0 0 24 24" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            }
          </span>
        }
        <>
          {fund && <input type="number" className="w-1/2 float-left rounded-md" placeholder="Amount" />}
        </>
      </div>
    </div>
  );
};