import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NameModalProps {
  visible: boolean;
  onNameSet: () => void;
}

export const NameModal: React.FC<NameModalProps> = ({visible, onNameSet}) => {
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    if (name.trim().length < 2) {
      Alert.alert('Error', 'Please enter a name (at least 2 characters)');
      return;
    }

    try {
      await AsyncStorage.setItem('userName', name.trim());
      onNameSet();
    } catch (error) {
      Alert.alert('Error', 'Failed to save name. Please try again.');
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to HandCrick!</Text>
          <Text style={styles.subtitle}>
            Please enter your name to continue
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#666"
            maxLength={20}
            autoFocus
          />
          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
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
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'LuckiestGuy-Regular',
    marginBottom: 10,
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'LuckiestGuy-Regular',
  },
});
