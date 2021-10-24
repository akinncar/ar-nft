import React from "react";
import {
  ViroARScene,
  ViroImage,
} from 'react-viro';

export function NftSceneAR({ uri }) {
  return (
    <ViroARScene>
      <ViroImage source={{ uri }}
        scale={[0.3, 0.3, 0.3]}
        position={[0, 0, -1]} />
    </ViroARScene>
  );
};