import React from "react";
import {
  Button,
  Image,
  Text,
  View
} from "react-native";
import Video from 'react-native-video';

export function NftItem({ nft, openCamera }) {
  return (
    <View style={{ padding: 16 }}>
      <View style={{ flexDirection: "row", paddingVertical: 16 }}>
        {nft.imageUrl.endsWith('.mp4')
          ? <Video
            style={{ height: 70, width: 70 }}
            source={{ uri: nft.imageUrl }}
            repeat
            paused
            bufferConfig={{
              bufferForPlaybackAfterRebufferMs: 5000,
              bufferForPlaybackMs: 2500,
              maxBufferMs: 50000,
              minBufferMs: 15000
            }}
          />
          : <Image style={{ height: 70, width: 70 }} source={{ uri: nft.imageUrl }} />
        }
        <Button title="View with your camera" onPress={() => openCamera(nft.imageUrl)} />
      </View>
    </View>
  );
}