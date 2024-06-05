import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB, Portal, PaperProvider } from 'react-native-paper';

const FloatingActionMenu = ({ onNewTopicPress, onAddLinkPress }) => {
  const [state, setState] = useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  return (
    <PaperProvider>
      <Portal>
        <View style={{ ...StyleSheet.absoluteFillObject, pointerEvents: open ? 'auto' : 'box-none' }}>
          <FAB.Group
            open={open}
            visible={true}
            icon={open ? 'close' : 'plus'}
            actions={[
              { icon: 'circle-outline', onPress: onNewTopicPress },
              { icon: 'arrow-top-right-thin', onPress: onAddLinkPress },
            ]}
            onStateChange={onStateChange}
            backdropColor="rgba(0, 0, 0, 0.0)"
            onPress={() => {
              if (open) {
                // could do something if the speed dial is open
              }
            }}
          />
        </View>
      </Portal>
    </PaperProvider>
  );
};

export default FloatingActionMenu;
