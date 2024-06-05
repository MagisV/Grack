import React from 'react';
import { View, TextInput, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native-paper';

const CustomModal = ({
  visible,
  modalType,
  newNodeName,
  setNewNodeName,
  newLinkSource,
  setNewLinkSource,
  newLinkTarget,
  setNewLinkTarget,
  sortedNodes,
  onAddNode,
  onAddLink,
  onClose,
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {modalType === 'newTopic' ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="New Topic"
                  value={newNodeName}
                  onChangeText={setNewNodeName}
                />
                <Button mode="contained" onPress={onAddNode}>Add</Button>
              </>
            ) : (
              <>
                <Picker
                  selectedValue={newLinkSource}
                  style={styles.picker}
                  onValueChange={(itemValue) => setNewLinkSource(itemValue)}
                >
                  <Picker.Item label="Select Source Node" value="" />
                  {sortedNodes.map((node) => (
                    <Picker.Item key={node.id} label={node.name} value={node.id} />
                  ))}
                </Picker>

                <Picker
                  selectedValue={newLinkTarget}
                  style={styles.picker}
                  onValueChange={(itemValue) => setNewLinkTarget(itemValue)}
                >
                  <Picker.Item label="Select Target Node" value="" />
                  {sortedNodes.map((node) => (
                    <Picker.Item key={node.id} label={node.name} value={node.id} />
                  ))}
                </Picker>

                <Button mode="contained" onPress={onAddLink}>Add</Button>
              </>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
});

export default CustomModal;
