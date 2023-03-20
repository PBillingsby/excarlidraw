import { useContext, useState } from "react";
import { UserContext } from "./context";
import BigNumber from 'bignumber.js'

export const ConnectWallet = ({ connectBundlr }) => {
  const { wallet, setWallet } = useContext(UserContext);
  const { isOpen } = useContext(UserContext);
  const [fundAmount, setFundAmount] = useState(0);
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    const wallets = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setWallet(wallets[0])
  };

  const fund = async () => {
    const bundlr = await connectBundlr();
    const parseAmount = parseInput(fundAmount, bundlr);

    setLoading(true)
    try {
      await bundlr.fund(parseAmount);
      setLoading(false)
      setPrompt({ success: true, msg: "Funded" })
    } catch (err) {
      setLoading(false)
      setPrompt({ success: false, msg: err.code.split("_").join(" ") })
      console.log(err)
    }
  }

  const parseInput = (input, bundlrInst) => {
    const conversion = new BigNumber(input).multipliedBy(bundlrInst.currencyConfig.base[1])
    if (conversion.isLessThan(1)) {
      console.log('error: value too small')
      return
    } else {
      return conversion.toNumber()
    }
  }

  const signOut = () => {
    setWallet(null)
  }

  return (
    <div className={`${isOpen && 'blur-sm'} flex justify-between p-4`}>
      <h1 className="text-2xl flex text-[#FF5F15]">excARlidraw<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brush" width="18" height="18" viewBox="0 0 24 24" stroke="#FF5F15" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 21v-4a4 4 0 1 1 4 4h-4"></path><path d="M21 3a16 16 0 0 0 -12.8 10.2"></path><path d="M21 3a16 16 0 0 1 -10.2 12.8"></path><path d="M10.6 9a9 9 0 0 1 4.4 4.4"></path></svg></h1>
      <div className="flex flex-col ">
        <button
          onClick={wallet ? signOut : handleConnect}
          className="px-5 py-2 bg-gray-500 hover:bg-gray-700 text-white cursor-pointer rounded-md">
          {wallet ?
            <div>
              {`${wallet.slice(0, 6)}...${wallet.slice(wallet.length - 6)}`}</div>
            :
            <p>Connect</p>
          }
        </button>
        <span className="mt-2 justify-around h-4 m-2">
          {wallet &&
            <>
              <input onChange={(e) => setFundAmount(e.target.value)} type="number" placeholder="amount" className="px-1 border border-gray-400 w-1/2 rounded-md" />
              <button onClick={fund} className="px-2 ml-2 bg-gray-500 hover:bg-gray-700 text-white cursor-pointer rounded-md">Fund</button>
              <div className="p-2 h-4">
                {loading && <p >...funding</p>}
                {prompt && <p className={`${prompt.success ? `text-green-600` : `text-red-600`}`}>{prompt.msg}</p>}
              </div>
            </>
          }
        </span>
      </div>
    </div>
  );
};