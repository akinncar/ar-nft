import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useWalletConnect,
  withWalletConnect
} from "@walletconnect/react-native-dapp";
import React from "react";
import {
  Button,
  FlatList,
  LogBox,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  View
} from "react-native";
import DeviceInfo from 'react-native-device-info'
import {
  ViroARSceneNavigator,
} from 'react-viro';

import { expo } from "../app.json";

import { NftItem } from "./components/NftItem";
import { NftSceneAR } from "./components/NftSceneAR";
import { fetchNfts } from "./services/fetchNfts";

LogBox.ignoreAllLogs()

function App(): JSX.Element {
  const connector = useWalletConnect();
  const [accounts, setAccounts] = React.useState([]);
  const [message, setMessage] = React.useState<string>("");
  const [nfts, setNfts] = React.useState([]);
  const [uri, setUri] = React.useState();

  const connectWallet = React.useCallback(() => {
    if (DeviceInfo.isEmulator()) {
      setAccounts(['0x6C99A69537aA5F3A1e2d846b8b85573d46D45E45']);
      return
    }

    return connector.connect();
  }, [connector]);

  const killSession = React.useCallback(() => {
    setNfts([])
    return connector.killSession();
  }, [connector]);

  async function loadNfts(account) {
    setMessage('Loading...')
    const nftList = await fetchNfts(account)
    setNfts(nftList)
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
      setAccounts(connector.accounts)
      loadNfts(connector.accounts[0]);
    }
  }, [connector]);

  React.useEffect(() => {
    if (accounts.length > 0 && nfts.length === 0) {
      loadNfts(accounts[0]);
    }
  }, [accounts, nfts]);

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
    <SafeAreaView style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
      <StatusBar barStyle='dark-content' />
      <Text>{message}</Text>
      {
        !connector.connected && (
          <Button title="Connect a Wallet" onPress={connectWallet} />
        )
      }
      <FlatList
        style={{ width: '100%' }}
        data={nfts}
        renderItem={({ item }) => <NftItem nft={item} openCamera={openCamera} />}
      />
      {
        !!connector.connected && (
          <Button title="Kill Session" onPress={killSession} />
        )
      }
    </SafeAreaView >
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
