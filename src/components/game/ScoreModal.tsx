import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';

interface ScoreModalProps {
  visible: boolean;
  userScore: number;
  botScore: number;
  onClose: () => void;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({
  visible,
  userScore,
  botScore,
  onClose,
}) => {
  const winner =
    userScore > botScore ? 'You' : botScore > userScore ? 'Bot' : 'Draw';

  const isUserWon = userScore > botScore;
  const isDraw = userScore === botScore;

  console.log('ScoreModal render:', { visible, userScore, botScore });

  if (!visible) {
    return null;
  }

  return (
    <Modal transparent visible={true} animationType="fade">
      <View style={styles.container}>
        <View style={styles.content}>
          <Text
            style={[
              styles.resultTitle,
              isUserWon
                ? styles.wonTitle
                : isDraw
                ? styles.drawTitle
                : styles.lostTitle,
            ]}
          >
            {isDraw ? 'DRAW!' : isUserWon ? 'YOU WON!' : 'YOU LOST!'}
          </Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>You: {userScore}</Text>
            <Text style={styles.scoreText}>Bot: {botScore}</Text>
          </View>
          <Text style={styles.subtitle}>
            {isDraw
              ? 'Great game!'
              : isUserWon
              ? 'Congratulations!'
              : 'Better luck next time!'}
          </Text>
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Okay</Text>
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
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    width: '85%',
    borderWidth: 2,
    borderColor: '#fff',
  },
  resultTitle: {
    fontSize: 42,
    fontFamily: 'LuckiestGuy-Regular',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  wonTitle: {
    color: '#4CAF50',
  },
  lostTitle: {
    color: '#F44336',
  },
  drawTitle: {
    color: '#FFC107',
  },
  scoreContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  scoreText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'LuckiestGuy-Regular',
    marginVertical: 5,
    textAlign: 'center',
  },
  subtitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'LuckiestGuy-Regular',
    marginBottom: 25,
    textAlign: 'center',
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'LuckiestGuy-Regular',
  },
});
