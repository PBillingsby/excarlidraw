import { useEffect, useState } from 'react';
import Arweave from 'arweave';
import { getIllustrations } from './queries';

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

export const View = ({ wallet, setView }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [uploads, setUploads] = useState();
  const [selected, setSelected] = useState();

  const handleClose = () => {
    setView(false);
    setIsOpen(false);
  };

  const getUploads = async () => {
    if (wallet) {
      try {
        const query = getIllustrations(wallet)

        const results = await arweave.api.post(
          `graphql`,
          query
        )
          .catch(err => {
            console.error('GraphQL query failed');
            throw new Error(err);
          });
        const edges = results.data.data.transactions.edges

        setUploads(edges)
      }
      catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    getUploads()
  }, [uploads]);

  const expand = (index) => {
    setSelected(uploads[index])
  }

  return (
    <>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto backdrop-blur-sm">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity transform duration-500" aria-hidden="true">
              <div className="absolute inset-0 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className={`p-4 w-[70vw] max-w-[90vw] max-h-[75vh] overflow-scroll inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all duration-1000 sm:my-8 sm:align-middle full`}>
              <div className="flex p-2 justify-between w-full">
                <h2 className="text-lg leading-6 font-medium text-gray-900">{uploads?.length} Uploads</h2>
                <p>Uploads may take some time to appear</p>
                <button
                  onClick={handleClose}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-x" width="28" height="28" viewBox="0 0 24 24" stroke="#FF5F15" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className={!selected && `grid gap-10 grid-cols-3 grid-rows-3`}>
                {(uploads && !selected) ?
                  uploads.map((upload, index) => {
                    return (
                      <div key={index} className="border text-sm cursor-zoom-in text-blue-600 p-4 overflow-scroll">
                        <img
                          className="max-w-[250px] max-h-[250px] mx-auto hover:scale-180 transition duration-300"
                          onClick={() => expand(index)}
                          src={`https://arweave.net/${upload.node.id}`}
                          alt="upload"
                        />
                      </div>
                    )
                  })
                  :
                  <div className="p-2 pt-8 text-[#FF5F15]">
                    <span className="flex justify-between">
                      <button onClick={() => setSelected(null)}><svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-big-left" width="32" height="32" viewBox="0 0 24 24" stroke="#FF5F15" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M20 15h-8v3.586a1 1 0 0 1 -1.707 .707l-6.586 -6.586a1 1 0 0 1 0 -1.414l6.586 -6.586a1 1 0 0 1 1.707 .707v3.586h8a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1z"></path></svg></button>
                      <a href={`https://arweave.net/${selected?.node?.id}`} target="_blank" rel="noreferrer"><svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-external-link" width="26" height="26" viewBox="0 0 24 24" stroke="#FF5F15" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5"></path><line x1="10" y1="14" x2="20" y2="4"></line><polyline points="15 4 20 4 20 9"></polyline></svg></a>
                    </span>
                    <img
                      className="m-auto"
                      src={`https://arweave.net/${selected?.node?.id}`}
                      alt="upload"
                    />
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
