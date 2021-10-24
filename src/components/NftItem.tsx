import React from "react";
import {
  Button,
  Image,
  Text,
  View
} from "react-native";

export function NftItem({ nft, openCamera }) {
  const [uri, setUri] = React.useState("");

  async function fetchImageUri(nft) {
    if (!nft.uri.startsWith("http")) return;

    const response = await fetch(nft.uri);
    const json = await response.json();

    setUri(json.image);
  }

  React.useEffect(() => {
    fetchImageUri(nft);
  }, [nft]);

  if (!nft.uri.startsWith("http")) return <></>;

  return (
    <View style={{ padding: 16 }}>
      <Text>{nft.address}</Text>
      <View style={{ flexDirection: "row", paddingVertical: 16 }}>
        <Image style={{ height: 70, width: 70 }} source={{ uri }} />
        <Button title="View with your camera" onPress={() => openCamera(uri)} />
      </View>
    </View>
  );
}