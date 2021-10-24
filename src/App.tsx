import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useWalletConnect,
  withWalletConnect
} from "@walletconnect/react-native-dapp";
import React from "react";
import {
  Button,
  LogBox,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import {
  ViroARSceneNavigator,
} from 'react-viro';

import { expo } from "../app.json";

import { NftItem } from "./components/NftItem";
import { NftSceneAR } from "./components/NftSceneAR";

LogBox.ignoreAllLogs()

function App(): JSX.Element {
  const connector = useWalletConnect();
  const [message, setMessage] = React.useState<string>("");
  const [nfts, setNfts] = React.useState([]);
  const [uri, setUri] = React.useState();

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  const killSession = React.useCallback(() => {
    setNfts([])
    return connector.killSession();
  }, [connector]);

  async function fetchNfts(account) {
    setMessage('Loading...')
    const response = await fetch(
      `https://api.paintswap.finance/userNFTs/${account}?allowNSFW=true&numToFetch=10&numToSkip=0`
    );
    const data = await response.json();
    setNfts(data.nfts);
    setMessage(null)
  }

  function openCamera(uri) {
    setUri(uri)
  }

  function closeCamera() {
    setUri(null)
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

  if (uri) {
    return (
      <View style={{ flex: 1 }}>
        <ViroARSceneNavigator
          style={{ flex: 1 }}
          autofocus={true}
          initialScene={{
            scene: () => <NftSceneAR uri={uri} />
          }}
        />
        <SafeAreaView>
          <Button title='Close Camera' onPress={closeCamera} />
        </SafeAreaView>
      </View>

    )
  }

  return (
    <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}>
      <StatusBar barStyle='dark-content' />
      <Text testID="tid-message">{message}</Text>
      {!connector.connected && (
        <Button title="Connect a Wallet" onPress={connectWallet} />
      )}
      {nfts.map(({ nft }) => {
        return <NftItem nft={nft} openCamera={openCamera} />;
      })}
      {!!connector.connected && (
        <Button title="Kill Session" onPress={killSession} />
      )}
    </View >
  );
}

const { scheme } = expo;

export default withWalletConnect(App, {
  redirectUrl: Platform.OS === "web" ? window.location.origin : `${scheme}://`,
  storageOptions: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    asyncStorage: AsyncStorage
  }
});
