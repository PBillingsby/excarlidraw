export const getIllustrations = (address) => {
  const results = {
    query: `
    query {
      transactions(
          tags: [
              {
                  name: "Uploader-Address",
                  values: ["${address}"]
              }
          ]
      ) {
        edges {
          node {
            id
            owner {
              address
            }
            fee {
              winston
              ar
            }
            quantity {
              winston
              ar
            }
            tags {
              name
              value
            }
          }
        }
      }
    }    
`}
  return results;

}