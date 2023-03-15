import './App.css';
import { useEffect, useState } from 'react';
import { Excalidraw, exportToCanvas } from "@excalidraw/excalidraw";
import { Modal } from './Modal';
import { View } from './View';
import { formatEther } from 'ethers';
import { ConnectWallet } from './ConnectWallet';
import { UserContext } from './context'

function App() {
  const [wallet, setWallet] = useState();
  const [tags, setTags] = useState([]);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [img, setImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState(false)

  useEffect(() => {
    getStoredWallet()
  }, [])

  const getStoredWallet = async () => {
    const storedWallet = await window.ethereum.request({ method: 'eth_accounts' })
    debugger
  }
  const getTxCost = async (bytes) => {
    const cost = await wallet?.getPrice(bytes);

    return formatEther(cost.toString().slice(0, 5))
  }

  const handleExport = async () => {
    const elements = excalidrawAPI.getSceneElements();
    if (!elements || !elements.length) {
      return
    }
    const canvas = await exportToCanvas({
      elements,
      files: excalidrawAPI.getFiles(),
      quality: 1,
    });

    setImg(canvas.toDataURL());
    setIsOpen(true);
  }

  const upload = async () => {
    const buffer = Buffer.from(img.split(',')[1], 'base64');
    setTags([...tags, { name: "Content-Type", value: "image/png" }, { name: "Uploader-Address", value: wallet.address }]);
    console.log(tags)
    const tagsString = JSON.stringify(tags);
    const bufferString = JSON.stringify(buffer);
    const bytes = new TextEncoder().encode(tagsString + bufferString).length;
    let confirmed
    if (bytes / 1024 >= 100) {
      const cost = await getTxCost(bytes);

      confirmed = window.confirm(`Are you sure you want to upload? \n It will cost ${cost} ${wallet.currency}`);
    } else {
      confirmed = window.confirm(`Are you sure you want to upload?`);
    }

    // try {
    //   if (!confirmed) {
    //     return;
    //   }
    const tx = await wallet.upload(buffer,
      {
        tags: tags,
      }
    );
    console.log(tx)
    // } catch (err) {
    //   console.log(err)
    // }
  }

  const viewUploads = async () => {
    debugger
  }

  return (
    <UserContext.Provider
      value={{
        bundlrInstance: wallet,
        setBundlrInstance: setWallet,
        isOpen: isOpen,
        setIsOpen: setIsOpen,
        img: img,
        upload: upload,
        tags: tags,
        setTags: setTags
      }}
    >
      <div className="App">
        <ConnectWallet />
        <div className="pt-10">
          <span className="flex justify-center gap-4">
            <button id="open"
              className="px-5 py-2 bg-gray-500 hover:bg-gray-700 text-white cursor-pointer rounded-md"
              onClick={handleExport}>Preview</button>
            <button id="open"
              className="px-5 py-2 bg-gray-500 hover:bg-gray-700 text-white cursor-pointer rounded-md"
              onClick={() => excalidrawAPI.resetScene()}>Clear</button>
            {wallet && <button id="open"
              className="px-5 py-2 bg-gray-500 hover:bg-gray-700 text-white cursor-pointer rounded-md"
              onClick={() => setView(true)}>View Uploads</button>
            }
          </span>
          <div style={{ height: "750px" }} className='custom-styles'>
            <Excalidraw ref={(api) => setExcalidrawAPI(api)} />
          </div>
          {view && <View />}
          {img && <Modal />}
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default App;
