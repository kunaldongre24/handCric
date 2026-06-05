import React from 'react';
import {Modal, View, Text, StyleSheet, Pressable} from 'react-native';

interface PauseModalProps {
  visible: boolean;
  onResume: () => void;
  onRestart: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  visible,
  onResume,
  onRestart,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Game Paused</Text>
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={onResume}
              style={[styles.button, styles.resumeButton]}>
              <Text style={styles.buttonText}>Resume</Text>
            </Pressable>
            <Pressable
              onPress={onRestart}
              style={[styles.button, styles.restartButton]}>
              <Text style={styles.buttonText}>Restart</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontFamily: 'LuckiestGuy-Regular',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
  },
  restartButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'LuckiestGuy-Regular',
  },
});
