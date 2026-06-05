import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Match {
  id: string;
  date: string;
  userScore: number;
  botScore: number;
  result: 'WON' | 'LOST' | 'DRAW';
}

interface MatchHistoryProps {
  visible: boolean;
  onClose: () => void;
}

export const MatchHistory: React.FC<MatchHistoryProps> = ({
  visible,
  onClose,
}) => {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    loadMatches();
  }, [visible]);

  const loadMatches = async () => {
    try {
      const storedMatches = await AsyncStorage.getItem('matchHistory');
      if (storedMatches) {
        setMatches(JSON.parse(storedMatches));
      }
    } catch (error) {
      console.error('Error loading match history:', error);
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'WON':
        return '#4CAF50';
      case 'LOST':
        return '#f44336';
      default:
        return '#FFC107';
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Match History</Text>
          <ScrollView style={styles.scrollView}>
            {matches.length === 0 ? (
              <Text style={styles.noMatches}>No matches played yet</Text>
            ) : (
              matches.map(match => (
                <View key={match.id} style={styles.matchCard}>
                  <View style={styles.matchHeader}>
                    <Text style={styles.date}>{match.date}</Text>
                    <Text
                      style={[
                        styles.result,
                        {color: getResultColor(match.result)},
                      ]}>
                      {match.result}
                    </Text>
                  </View>
                  <View style={styles.scoreContainer}>
                    <View style={styles.scoreBox}>
                      <Text style={styles.scoreLabel}>You</Text>
                      <Text style={styles.score}>{match.userScore}</Text>
                    </View>
                    <Text style={styles.vs}>VS</Text>
                    <View style={styles.scoreBox}>
                      <Text style={styles.scoreLabel}>Bot</Text>
                      <Text style={styles.score}>{match.botScore}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
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
    width: '90%',
    maxHeight: '80%',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'LuckiestGuy-Regular',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: '80%',
  },
  noMatches: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  matchCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  date: {
    color: '#fff',
    fontSize: 14,
  },
  result: {
    fontSize: 16,
    fontFamily: 'LuckiestGuy-Regular',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreBox: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  score: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'LuckiestGuy-Regular',
  },
  vs: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'LuckiestGuy-Regular',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'LuckiestGuy-Regular',
  },
});
