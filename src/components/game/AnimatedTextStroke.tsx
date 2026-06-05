import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, Dimensions } from 'react-native';
import { TextStroke } from './TextStroke';
import { numberTextMap } from '../../utils/game';

interface AnimatedTextStrokeProps {
  visible: boolean;
  number: number;
  isUserBatting: boolean;
}

export const AnimatedTextStroke: React.FC<AnimatedTextStrokeProps> = ({
  visible,
  number,
  isUserBatting,
}) => {
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 7) return '#FF4444'; // Red for wicket
    if (score === 6) return '#4CAF50'; // Green for six
    if (score === 4) return '#FF9800'; // Orange for four
    if (score === 0) return '#9E9E9E'; // Gray for dot ball
    return '#2196F3'; // Blue for other runs (1,2,3,5)
  };

  const scoreColor = getScoreColor(number);

  useEffect(() => {
    if (visible) {
      // Reset position to center
      position.setValue({
        x: Dimensions.get('window').width / 2 - 75,
        y: Dimensions.get('window').height / 3 - 40,
      });
      scale.setValue(0);
      opacity.setValue(0);

      // Animate scale and opacity, then delay, then move to top left
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }),
        Animated.delay(400),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 0.2,
            useNativeDriver: true,
            duration: 600,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(position, {
            toValue: {
              x: isUserBatting ? -50 : Dimensions.get('window').width - 75,
              y: 40,
            },
            useNativeDriver: true,
            duration: 1000,
          }),
        ]),
      ]).start();
    }
  }, [visible, number]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: position.x },
            { translateY: position.y },
            { scale },
          ],
          opacity,
        },
      ]}
    >
      <TextStroke stroke={2} color={'#fff'}>
        {number < 7 ? (
          <Text
            style={{
              fontSize: 60,
              color: scoreColor,
              fontFamily: 'LuckiestGuy-Regular',
              textAlign: 'center',
            }}
          >
            {number}
          </Text>
        ) : (
          <Text
            style={{
              fontSize: 60,
              color: scoreColor,
              fontFamily: 'LuckiestGuy-Regular',
              textAlign: 'center',
            }}
          >
            W
          </Text>
        )}
        <Text
          style={{
            fontSize: 40,
            color: scoreColor,
            fontFamily: 'LuckiestGuy-Regular',
            textAlign: 'center',
            marginTop: -20,
            width: 150,
          }}
        >
          {' '}
          {number === 0
            ? 'Dot'
            : number > 7
            ? 'Runs'
            : numberTextMap[number - 1]}{' '}
        </Text>
      </TextStroke>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
});
