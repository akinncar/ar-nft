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
  View,
} from "react-native";
import localhost from "react-native-localhost";
import Web3 from "web3";

import { expo } from "../app.json";
import Hello from "../artifacts/contracts/Hello.sol/Hello.json";

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

function App(): JSX.Element {
  const connector = useWalletConnect();
  const [message, setMessage] = React.useState<string>("Loading...");
  const [nfts, setNfts] = React.useState([]);
  const web3 = React.useMemo(
    () =>
      new Web3(
        new Web3.providers.HttpProvider(`http://${localhost}:${HARDHAT_PORT}`)
      ),
    [HARDHAT_PORT]
  );

  React.useEffect(() => {
    (async () => {
      const { address } = await web3.eth.accounts.privateKeyToAccount(
        HARDHAT_PRIVATE_KEY
      );
      const contract = await shouldDeployContract(
        web3,
        Hello.abi,
        Hello.bytecode,
        address
      );
      setMessage(await contract.methods.sayHello("React Native").call());
    })();
  }, [web3, shouldDeployContract, setMessage, HARDHAT_PRIVATE_KEY]);

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  const signTransaction = React.useCallback(async () => {
    try {
      await connector.signTransaction({
        data: "0x",
        from: "0xbc28Ea04101F03aA7a94C1379bc3AB32E65e62d3",
        gas: "0x9c40",
        gasPrice: "0x02540be400",
        nonce: "0x0114",
        to: "0x89D24A7b4cCB1b6fAA2625Fe562bDd9A23260359",
        value: "0x00",
      });
    } catch (e) {
      console.error(e);
    }
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
    if (connector.accounts.length > 0) {
      fetchNfts(connector.accounts[0]);
    }
  }, [connector]);

  React.useEffect(() => {
    if (connector.accounts.length > 0) {
      fetchNfts(connector.accounts[0]);
    }
  }, [nfts]);

  return (
    <View style={[StyleSheet.absoluteFill, styles.center, styles.white]}>
      <Text testID="tid-message">{message}</Text>
      {!connector.connected && (
        <TouchableOpacity onPress={connectWallet}>
          <Text>Connect a Wallet</Text>
        </TouchableOpacity>
      )}
      {!!connector.connected && (
        <>
          <TouchableOpacity onPress={signTransaction}>
            <Text>Sign a Transaction</Text>
          </TouchableOpacity>
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
