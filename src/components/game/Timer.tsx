import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';

interface TimerProps {
  isActive: boolean;
  onComplete: () => void;
}

const WAITING_TIME = 5;

export const Timer: React.FC<TimerProps> = ({isActive, onComplete}) => {
  const progress = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<any>(null);
  const [timeLeft, setTimeLeft] = useState(WAITING_TIME);

  useEffect(() => {
    if (isActive) {
      // Reset progress
      progress.setValue(1);
      setTimeLeft(WAITING_TIME);

      // Start the timer
      const startTime = Date.now();
      const duration = WAITING_TIME * 1000;

      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 1 - elapsed / duration);

        progress.setValue(remaining);
        setTimeLeft(Math.ceil(remaining * WAITING_TIME));

        if (remaining <= 0) {
          clearInterval(timerRef.current);
          onComplete();
        }
      }, 16); // ~60fps
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, onComplete, progress]);

  if (!isActive) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{timeLeft}</Text>
      <View style={styles.timerContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 12,
  },
  timerContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  timerText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'LuckiestGuy-Regular',
  },
});
