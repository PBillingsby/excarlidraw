import { useContext } from 'react';
import { UserContext } from './context';

export const Modal = () => {
  const { bundlrInstance, isOpen, setIsOpen, img, upload, tags, setTags } = useContext(UserContext);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAddPair = () => {
    if (tags.length < 3) {
      setTags([...tags, { name: '', value: '' }]);
    }
  };

  const handlePairChange = (index, keyOrValue, newValue) => {
    const newPairs = [...tags];
    newPairs[index][keyOrValue] = newValue;
    setTags(newPairs);
  };

  console.log(tags)
  return (
    <>
      {isOpen && (
        <div className="overflow-scroll max-h-90 fixed z-10 inset-0 overflow-y-auto backdrop-blur-sm">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity transform duration-500" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="max-w-[80vw] inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all duration-1000 sm:my-8 sm:align-middle full">
              <div className="flex p-2 justify-between w-full">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Preview</h2>
                <button
                  onClick={handleClose}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-x" width="28" height="28" viewBox="0 0 24 24" stroke="red" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <div className="mt-2">
                      <img className="m-auto" src={img} alt="" />
                    </div>
                  </div>
                </div>
              </div>
              {bundlrInstance ?
                <div className="bg-gray-50 px-4 py-3 sm:px-6 flex gap-4 justify-center">
                  <button className="flex px-5 py-2 bg-gray-500 hover:bg-gray-700 text-white cursor-pointer rounded-md" onClick={handleAddPair}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-plus" width="26" height="26" viewBox="0 0 24 24" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-tag" width="26" height="26" viewBox="0 0 24 24" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
                      <path d="M4 7v3.859c0 .537 .213 1.052 .593 1.432l8.116 8.116a2.025 2.025 0 0 0 2.864 0l4.834 -4.834a2.025 2.025 0 0 0 0 -2.864l-8.117 -8.116a2.025 2.025 0 0 0 -1.431 -.593h-3.859a3 3 0 0 0 -3 3z" />
                    </svg>

                  </button>
                  <button className="px-5 py-2 bg-gray-500 hover:bg-gray-700 text-white cursor-pointer rounded-md" onClick={upload}>Upload</button>
                </div>
                :
                <h3 className="px-5 py-2 text-md text-center">Connect to upload</h3>
              }
              <div className="p-2">
                {tags.length > 2 && tags.map((pair, index) => (
                  <div key={index} className="flex gap-2 p-2">
                    <input
                      type="text"
                      placeholder="name"
                      value={pair.name}
                      onChange={(e) => handlePairChange(index, 'name', e.target.value)}
                      className="w-1/2 py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="value"
                      value={pair.value}
                      onChange={(e) => handlePairChange(index, 'value', e.target.value)}
                      className="w-1/2 py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="mt-2 icon icon-tabler icon-tabler-check" width="26" height="26" viewBox="0 0 24 24" stroke="green" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M5 12l5 5l10 -10" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
