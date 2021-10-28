import React from "react";
import {
  ViroARScene,
  ViroImage,
  ViroVideo
} from 'react-viro';

export function NftSceneAR({ uri }) {
  return (
    <ViroARScene>
      {uri.endsWith('.mp4')
        ? <ViroVideo source={{ uri }}
          scale={[0.3, 0.3, 0.3]}
          position={[0, 0, -1]} />
        : <ViroImage source={{ uri }}
          scale={[0.3, 0.3, 0.3]}
          position={[0, 0, -1]} />
      }
    </ViroARScene>
  );
};