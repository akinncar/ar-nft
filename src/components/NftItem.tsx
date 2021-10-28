import React from "react";
import {
  Button,
  Image,
  Text,
  View
} from "react-native";
import Video from 'react-native-video';

export function NftItem({ nft, openCamera }) {
  const [uri, setUri] = React.useState("");

  function replaceUrl(nftUri) {
    if (nftUri.startsWith("ipfs")) {
      return nftUri.replace('ipfs://', 'https://ipfs.io/ipfs/')
    }

    return nftUri
  }

  async function fetchImageUri(nft) {
    const url = await replaceUrl(nft.uri)

    const response = await fetch(url);
    const json = await response.json();

    const image = await replaceUrl(json.image)

    setUri(image);
  }

  React.useEffect(() => {
    fetchImageUri(nft);
  }, [nft]);

  return (
    <View style={{ padding: 16 }}>
      <Text>{nft.address}</Text>
      <View style={{ flexDirection: "row", paddingVertical: 16 }}>
        {uri.endsWith('.mp4')
          ? <Video
            style={{ height: 70, width: 70 }}
            source={{ uri }}
            repeat
            bufferConfig={{
              bufferForPlaybackAfterRebufferMs: 5000,
              bufferForPlaybackMs: 2500,
              maxBufferMs: 50000,
              minBufferMs: 15000
            }}
          />
          : <Image style={{ height: 70, width: 70 }} source={{ uri }} />
        }
        <Button title="View with your camera" onPress={() => openCamera(uri)} />
      </View>
    </View>
  );
}