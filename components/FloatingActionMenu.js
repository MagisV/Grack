import { style } from 'd3';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { FAB, Portal, Menu, Provider, PaperProvider } from 'react-native-paper';

const FloatingActionMenu = ({ onNewTopicPress, onAddLinkPress }) => {
  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  return (
    <PaperProvider>
      <Portal>
        <FAB.Group
          open={open}
          visible={true}
          icon={open ? 'close' : 'plus'}
          // style={styles.fab}
          actions={[
            { icon: 'plus', label: 'Topic', onPress: onNewTopicPress },
            { icon: 'link', label: 'Link', onPress: onAddLinkPress },
          ]}
          onStateChange={onStateChange}
          onPress={() => { 
            if (open) {
              // could do something if the speed dial is open
            }
          }
        } />
      </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#6200ee',
  },
});

export default FloatingActionMenu;
