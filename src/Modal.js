import { useContext, useState } from 'react';
import { UserContext } from './context';

export const Modal = () => {
  const { isOpen, setIsOpen, img, upload, tags, setTags } = useContext(UserContext);
  const [tagInput, setTagInput] = useState({});
  const [inputErr, setInputErr] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadId, setUploadId] = useState(null);

  const handleClose = () => {
    setTags([])
    setUploadId(null)
    setIsOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTagInput((prevtagInput) => ({ ...prevtagInput, [name]: value }));
  };


  const uploadImage = async () => {
    setIsSubmitted(true)
    try {
      const res = await upload()
      setUploadId(res.id)
    } catch (err) {
      setTags([])
      console.log(err)
    }
    setIsSubmitted(false)
  }

  const addTag = () => {
    if (Object.values(tagInput).length !== 2) {
      setInputErr(true)
      return
    }
    setTags([...tags, tagInput]);
    setTagInput({});
    document.getElementById('name').value = ''
    document.getElementById('value').value = ''
    setInputErr(false)
  }
  return (
    <>
      {isOpen && (
        <div className="overflow-scroll max-h-90 fixed z-10 inset-0 overflow-y-auto backdrop-blur-sm">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity transform duration-500" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all duration-1000 sm:my-8 sm:align-middle full">
              <div className="flex p-2 justify-between w-full">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Preview</h2>
                <button
                  onClick={handleClose}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-x cursor-pointer m-auto" width="28" height="28" viewBox="0 0 24 24" stroke="red" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <div className="mt-2">
                    <img className="relative m-auto max-w-[80vw] max-h-[50vh] object-contain" src={img} alt="" />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 flex gap-4 justify-center">
                {uploadId ?
                  <>
                    <p>TX ID: {uploadId}</p>
                    <a href={`https://arweave.net/${uploadId}`} target="_blank" rel="noreferrer"><svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-external-link" width="26" height="26" viewBox="0 0 24 24" stroke="#FF5F15" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5"></path><line x1="10" y1="14" x2="20" y2="4"></line><polyline points="15 4 20 4 20 9"></polyline></svg></a>
                  </>

                  :
                  <button className="px-5 py-2 bg-gray-500 hover:bg-gray-700 text-white cursor-pointer rounded-md" onClick={uploadImage}>Upload</button>
                }
              </div>
              {!uploadId && <div className="p-2">
                {inputErr && <p className="text-red-500 text-center">Name and value required</p>}
                <div className="flex gap-2 p-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="name"
                    onChange={handleInputChange}
                    value={tagInput.name}
                    className={`w-1/2 py-2 px-4 rounded-md border ${inputErr ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`}
                  />
                  <input
                    id="value"
                    name="value"
                    type="text"
                    placeholder="value"
                    value={tagInput.value}
                    onChange={handleInputChange}
                    className={`w-1/2 py-2 px-4 rounded-md border ${inputErr ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={addTag} className="icon icon-tabler icon-tabler-plus m-auto cursor-pointer" width="20" height="20" viewBox="0 0 24 24" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
              </div>
              }
              <div>
                {isSubmitted ?
                  <p className='text-center'>...loading</p>
                  :
                  <div>
                    {tags.map((tag, index) => {
                      return (
                        <div key={index} className="items-center bg-gray-100 rounded-md px-3 py-1 my-1">
                          <span className="font-medium">Name: {tag.name}</span>
                          <span className="ml-2">Value: {tag.value}</span>
                        </div>
                      );
                    })}
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
