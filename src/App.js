import './App.css';
import { useState } from 'react';
import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw";
import { Modal } from './Modal';
import { View } from './View';
import { utils } from 'ethers';
import { ConnectWallet } from './ConnectWallet';
import { UserContext } from './context'
import { providers } from 'ethers'
import { WebBundlr } from '@bundlr-network/client';

function App() {
  const [tags, setTags] = useState([]);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [img, setImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState(false);

  const getTxCost = async (bundlrInstance, bytes) => {
    const cost = await bundlrInstance?.getPrice(bytes);

    return utils.formatEther(cost.toString().slice(0, 5))
  }

  const handleExport = async () => {
    const elements = excalidrawAPI.getSceneElements();
    if (!elements || !elements.length) {
      return
    }

    const blob = await exportToBlob({
      elements,
      files: excalidrawAPI.getFiles(),
      quality: 1,
    });

    const reader = new FileReader();
    reader.onload = () => {
      setImg(reader.result);
    };
    reader.onerror = (error) => {
      console.error(error);
    };

    reader.readAsDataURL(blob);

    setIsOpen(true);
  }

  const connectBundlr = async () => {
    const provider = new providers.Web3Provider(window.ethereum);
    await provider._ready();

    const bundlr = new WebBundlr("https://node2.bundlr.network", "matic", provider);
    await bundlr.ready();

    return bundlr
  }

  const upload = async () => {
    try {
      const bundlrInstance = await connectBundlr();
      const buffer = Buffer.from(img.split(',')[1], 'base64');

      setTags([...tags,
      { name: 'App-Name', value: 'Excarlidraw-v1' },
      { name: "Content-Type", value: "image/png" },
      { name: "Uploader-Address", value: bundlrInstance.address }]);

      const bufferBytes = buffer.length;
      const objectsString = JSON.stringify(tags);
      const objectsBytes = new TextEncoder().encode(objectsString).length;
      const totalBytes = bufferBytes + objectsBytes;

      const balance = await bundlrInstance.getLoadedBalance();
      let confirmed
      if (totalBytes / 1024 >= 100) {
        const cost = await getTxCost(bundlrInstance, totalBytes);
        confirmed = window.confirm(`Are you sure you want to upload? \n Your balance is ${bundlrInstance.utils.unitConverter(balance)}\n It will cost ${cost > 0.0001 ? cost : `~ 0.0005`} ${bundlrInstance.currency}`);
      } else {
        confirmed = window.confirm(`Are you sure you want to upload?`);
      }
      if (confirmed) {
        try {
          const tx = await bundlrInstance.upload(buffer,
            {
              tags: tags,
            }
          );
          console.log(tx)
          return tx
        } catch (err) {
          console.log(err)
        }
      }
      setTags([])
    } catch (err) {
      console.log(err)
    }
  }


  const handleClear = () => {
    setTags([])
    excalidrawAPI.resetScene()
  }

  return (
    <UserContext.Provider
      value={{
        wallet: wallet,
        setWallet: setWallet,
        isOpen: isOpen,
        setIsOpen: setIsOpen,
        img: img,
        upload: upload,
        tags: tags,
        setTags: setTags
      }}
    >
      <div className="App">
        <ConnectWallet connectBundlr={connectBundlr} />
        <div className="pt-10">
          <span className="flex justify-center gap-4">
            <button id="open"
              className="px-5 py-2 bg-gray-500 hover:bg-gray-700 text-white cursor-pointer rounded-md"
              onClick={handleExport}>Preview</button>
            <button id="open"
              className="px-5 py-2 bg-gray-500 hover:bg-gray-700 text-white cursor-pointer rounded-md"
              onClick={handleClear}>Clear</button>
            {wallet && <button id="open"
              className="px-5 py-2 bg-gray-500 hover:bg-gray-700 text-white cursor-pointer rounded-md"
              onClick={() => setView(!view)}>View Uploads</button>
            }
          </span>
          <div style={{ height: "750px" }} className='custom-styles'>
            <Excalidraw ref={(api) => setExcalidrawAPI(api)} />
          </div>
          {view && <View wallet={wallet} setView={setView} />}
          {img && <Modal />}
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default App;
