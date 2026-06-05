import React, {useEffect, useRef, memo} from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

const lotties = [
  require('../../game-assets/lotties/gesture-1.json'),
  require('../../game-assets/lotties/gesture-2.json'),
  require('../../game-assets/lotties/gesture-3.json'),
  require('../../game-assets/lotties/gesture-4.json'),
  require('../../game-assets/lotties/gesture-5.json'),
  require('../../game-assets/lotties/gesture-6.json'),
];

interface HandContainerProps {
  inverted?: boolean;
  runs: number;
  ballCount: number;
  ballRunning: boolean;
  started: boolean;
}

export const HandContainer: React.FC<HandContainerProps> = memo(({
  inverted,
  runs,
  ballCount,
  ballRunning,
  started,
}) => {
  const lottieRef = useRef<LottieView>(null);
  const rotateX = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  const pumpHand = () => {
    isAnimating.current = true;

    Animated.parallel([]).start(() => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(rotateX, {
            toValue: 0.7,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),

        Animated.parallel([
          Animated.timing(rotateX, {
            toValue: 0.15,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),

        Animated.parallel([
          Animated.timing(rotateX, {
            toValue: 0.25,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),

        Animated.parallel([
          Animated.timing(rotateX, {
            toValue: 0.2,
            duration: 80,
            useNativeDriver: true,
          }),
        ]),

        Animated.parallel([
          Animated.spring(rotateX, {
            toValue: 0.2,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        isAnimating.current = false;
      });
    });
  };

  const closeHand = () => {
    isAnimating.current = true;

    Animated.parallel([]).start(() => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(rotateX, {
            toValue: 0.6,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(rotateX, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        isAnimating.current = false;
      });
    });
  };
  useEffect(() => {
    lottieRef.current?.play();
    if (ballRunning) {
      closeHand();
    } else {
      pumpHand();
    }
  }, [runs, ballCount, ballRunning]);

  return (
    <View>
      <Animated.View
        style={{
          transform: [
            {translateX: inverted ? 200 : -200},
            {
              rotateZ: rotateX.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', inverted ? '45deg' : '-45deg'],
              }),
            },
            {perspective: 1000},
            {translateX: inverted ? -200 : 200},
          ],
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            transform: [
              {rotateY: inverted ? '180deg' : '0deg'},
              {rotate: '-15deg'},
            ],
          }}>
          <View style={{marginTop: 53, marginRight: -10}}>
            <View
              style={{
                borderTopWidth: 2,
                borderColor: '#fff',
                height: 6,
                width: 80,
              }}
            />
            <View
              style={{
                borderTopWidth: 2,
                borderColor: '#fff',
                height: 6,
                width: 80,
                marginTop: 35,
                transform: [{rotate: '-9deg'}],
              }}
            />
          </View>

          <LottieView
            source={lotties[runs - 1 < 0 ? 0 : runs - 1]}
            autoPlay={runs > 0}
            loop={false}
            ref={lottieRef}
            speed={
              !started || (ballRunning && runs > 0) ? -2.5 : runs > 0 ? 2.5 : 0
            }
            style={[
              styles.handStyle,
              {transform: [{rotateX: '180deg'}, {rotateZ: '90deg'}]},
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  handStyle: {
    width: 120,
    height: 120,
  },
});
