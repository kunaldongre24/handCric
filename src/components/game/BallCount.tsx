import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BallCountProps {
  userBalls: { runs: number; symbol: string }[];
  botBalls: { runs: number; symbol: string }[];
  username?: string;
  isSecondInnings?: boolean;
  target?: number;
  totalBalls?: number;
}

export const BallCount: React.FC<BallCountProps> = memo(({
  userBalls,
  botBalls,
  username,
  isSecondInnings,
  target,
  totalBalls,
}) => {
  const getRemainingRuns = () => {
    if (!isSecondInnings || !target) return 0;
    const currentRuns = userBalls.reduce(
      (sum, ball) => sum + (ball?.runs || 0),
      0,
    );
    return target - currentRuns;
  };

  const getRemainingBalls = () => {
    if (!totalBalls) return 0;
    return totalBalls - userBalls.length;
  };

  return (
    <View style={styles.container}>
      {isSecondInnings && target && (
        <View style={styles.targetContainer}>
          <Text style={styles.targetText}>
            {getRemainingRuns()} runs required in {getRemainingBalls()} balls
          </Text>
        </View>
      )}
      <View style={styles.ballContainer}>
        <Text style={styles.label}>{username ?? 'You'}</Text>
        <View style={styles.balls}>
          {[...Array(6)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.ball,
                userBalls[index] !== undefined && styles.ballFilled,
                userBalls[index]?.symbol === 'w' && styles.wicketBall,
              ]}
            >
              <Text
                style={
                  userBalls[index]?.symbol === 'w'
                    ? styles.wicketBallTexT
                    : styles.ballText
                }
              >
                {userBalls[index]?.symbol
                  ? userBalls[index].symbol.toUpperCase()
                  : ''}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.ballContainer}>
        <Text style={[{ textAlign: 'right' }, styles.label]}>Bot</Text>
        <View style={styles.balls}>
          {[...Array(6)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.ball,
                botBalls[index] !== undefined && styles.ballFilled,
                botBalls[index]?.symbol === 'w' && styles.wicketBall,
              ]}
            >
              <Text
                style={
                  botBalls[index]?.symbol === 'w'
                    ? styles.wicketBallTexT
                    : styles.ballText
                }
              >
                {botBalls[index]?.symbol
                  ? botBalls[index].symbol.toUpperCase()
                  : ''}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 24,
    top: 100,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ballContainer: {
    marginVertical: 5,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'LuckiestGuy-Regular',
    marginBottom: 5,
  },
  balls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  ball: {
    width: 18,
    height: 18,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ballFilled: {
    backgroundColor: '#f5f5f5',
  },
  wicketBall: {
    backgroundColor: '#FF474C',
  },
  wicketBallTexT: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 600,
  },
  ballText: {
    color: '#000',
    fontSize: 11,
    fontWeight: 600,
  },
  targetContainer: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  targetText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'LuckiestGuy-Regular',
    textAlign: 'center',
  },
});
