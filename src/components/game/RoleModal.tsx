import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { GameRole } from '../../utils/game';

interface RoleModalProps {
  visible: boolean;
  role: GameRole;
  target: number;
}

export const RoleModal: React.FC<RoleModalProps> = ({
  visible,
  role,
  target,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>You are</Text>
          <Text style={styles.role}>
            {role === GameRole.Batting ? 'BATTING' : 'BOWLING'}
          </Text>
          {role === GameRole.Bowling ||
            (target > 0 && <Text style={styles.target}>Target: {target}</Text>)}
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
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'LuckiestGuy-Regular',
    marginBottom: 10,
  },
  role: {
    color: '#fff',
    fontSize: 36,
    fontFamily: 'LuckiestGuy-Regular',
  },
  target: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'LuckiestGuy-Regular',
    marginTop: 10,
  },
});
