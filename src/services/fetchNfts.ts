export type Nft = {
  imageUrl: string
}

function replaceUri(uri) {
  if (uri.startsWith("ipfs")) {
    return uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
  }

  return uri
}

async function fetchImageUri(uri) {
  const replacedUri = await replaceUri(uri)
  const response = await fetch(replacedUri);
  const json = await response.json();

  const imageUri = await replaceUri(json.image)

  return imageUri
}

async function fetchOpenSeaNfts(account: string): Promise<Array<Nft>> {
  const response = await fetch(
    `https://api.opensea.io/api/v1/assets?owner=${account}&order_direction=desc&offset=0&limit=50`
  );
  const data = await response.json();

  const nftList: Array<Nft>  = data.assets.map((nft) => {
    const nftNewFormat: Nft = {
      imageUrl: nft.image_url
    }
    return nftNewFormat
  })

  return nftList
}

async function fetchPaintSwapNfts(account: string): Promise<Array<Nft>> {
  const response = await fetch(
    `https://api.paintswap.finance/userNFTs/${account}?allowNSFW=true&numToFetch=10&numToSkip=0`
  );
  const data = await response.json();

  const nftList: Array<Nft> = await data.nfts.map(async ({ nft }) => {
    const imageUrl = await fetchImageUri(nft.uri)

    const nftNewFormat: Nft = {
      imageUrl
    }
    return nftNewFormat
  })

  return Promise.all(nftList)
}

export async function fetchNfts(account) {
  const nftList: Array<Nft> = [] as Array<Nft>

  const openSeaNfts = await fetchOpenSeaNfts(account)
  nftList.push(...openSeaNfts)

  const paintSwapNfts = await fetchPaintSwapNfts(account)
  console.log({paintSwapNfts})
  nftList.push(...paintSwapNfts)

  return nftList
}