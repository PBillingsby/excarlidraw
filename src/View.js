import { useEffect, useState, useContext } from 'react';
import { UserContext } from './context';
import Arweave from 'arweave';

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

export const View = () => {
  const { bundlrInstance } = useContext(UserContext)
  const [isOpen, setIsOpen] = useState(true);
  const [uploads, setUploads] = useState();
  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    getUploads()
  }, []);

  const getUploads = async () => {
    if (bundlrInstance?.address) {
      try {
        const results = await arweave.api.post(`graphql`,
          `query {
          transactions(
              tags: {
                  name: "Uploader-Address",
                  values: ["${bundlrInstance?.address}"]
              }
          ) {
              edges {
                  node {
                      id
                  }
              }
          }
      }`
        )
          .catch(err => {
            console.error('GraphQL query failed');
            throw new Error(err);
          });

        const edges = results.data.data.transactions.edges;
        setUploads(edges);
      }
      catch (error) {
        console.log(error);
      }
    }
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
            <div className="max-w-[80vw] inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all duration-1000 sm:my-8 sm:align-middle full">
              <div className="flex p-2 justify-between w-full">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Preview</h2>
                <button
                  onClick={handleClose}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-x" width="28" height="28" viewBox="0 0 24 24" stroke="red" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
