import React, {useEffect, useState, useRef, memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface CountdownTimerProps {
  duration: number;
  onFinish: () => void;
  isActive: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = memo(({
  duration,
  onFinish,
  isActive,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef<any>(undefined);
  const onFinishRef = useRef<() => void>(onFinish);

  // Update the ref when onFinish changes
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    // Reset timer when isActive becomes true
    setTimeLeft(duration);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          // Use setTimeout to ensure onFinish is called after the render cycle
          setTimeout(() => {
            onFinishRef.current();
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, duration]);

  if (!isActive) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{timeLeft}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 12,
  },
  timerText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'LuckiestGuy-Regular',
  },
});
