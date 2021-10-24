import { HARDHAT_PORT, HARDHAT_PRIVATE_KEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useWalletConnect,
  withWalletConnect,
} from "@walletconnect/react-native-dapp";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import localhost from "react-native-localhost";
import Web3 from "web3";

import { expo } from "../app.json";
// import Hello from "../artifacts/contracts/Hello.sol/Hello.json";

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" },
  // eslint-disable-next-line react-native/no-color-literals
  white: { backgroundColor: "white" },
});

const shouldDeployContract = async (web3, abi, data, from: string) => {
  const deployment = new web3.eth.Contract(abi).deploy({ data });
  const gas = await deployment.estimateGas();
  const {
    options: { address: contractAddress },
  } = await deployment.send({ from, gas });
  return new web3.eth.Contract(abi, contractAddress);
};

function Nft({ nft }) {
  const [uri, setUri] = React.useState('');

  async function fetchImageUri(nft) {
    if (!nft.uri.startsWith('http')) return

    const response = await fetch(nft.uri);
    const json = await response.json();

    if (json.image) {
      console.log(json)
      setUri(json.image)
    }
  }

  React.useEffect(() => {
    fetchImageUri(nft)
  }, [nft])

  return (
    <View>
      <Text>{nft.address}</Text>
      <Image style={{ width: 70, height: 70 }} source={{ uri }} />
    </View>
  )
}

function App(): JSX.Element {
  const connector = useWalletConnect();
  const [message, setMessage] = React.useState<string>("Loading...");
  const [nfts, setNfts] = React.useState([]);

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  async function fetchNfts(account) {
    const response = await fetch(
      `https://api.paintswap.finance/userNFTs/${account}?allowNSFW=true&numToFetch=10&numToSkip=0`
    );
    const data = await response.json();
    setNfts(data.nfts);
  }

  React.useEffect(() => {
    if (connector?.accounts?.length > 0) {
      fetchNfts(connector.accounts[0]);
    }
  }, [connector]);

  React.useEffect(() => {
    if (connector?.accounts?.length > 0 && !nfts) {
      fetchNfts(connector.accounts[0]);
    }
  }, [nfts]);

  return (
    <View style={[StyleSheet.absoluteFill, styles.center, styles.white]}>
      {/* <Text testID="tid-message">{message}</Text> */}
      {!connector.connected && (
        <TouchableOpacity onPress={connectWallet}>
          <Text>Connect a Wallet</Text>
        </TouchableOpacity>
      )}
      {nfts.map(({ nft }) => {
        return <Nft nft={nft} />
      })}
      {!!connector.connected && (
        <>
          <TouchableOpacity onPress={killSession}>
            <Text>Kill Session</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const { scheme } = expo;

export default withWalletConnect(App, {
  redirectUrl: Platform.OS === "web" ? window.location.origin : `${scheme}://`,
  storageOptions: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    asyncStorage: AsyncStorage,
  },
});