import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Image, Animated, StyleSheet, ImageBackground} from 'react-native';
import LottieView from 'lottie-react-native';

const lotties = [
  require('../../game-assets/lotties/gesture-1.json'),
  require('../../game-assets/lotties/gesture-2.json'),
  require('../../game-assets/lotties/gesture-3.json'),
  require('../../game-assets/lotties/gesture-4.json'),
  require('../../game-assets/lotties/gesture-5.json'),
  require('../../game-assets/lotties/gesture-6.json'),
];

// Preload all assets
const assets = [
  require('../../game-assets/assets/cricket-pitch.png'),
  require('../../game-assets/assets/cricket-stadium-dark.png'),
];

interface PreloaderProps {
  onLoadComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({onLoadComplete}) => {
  const progress = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading...');

  useEffect(() => {
    const loadingSequence = async () => {
      try {
        // First load all assets
        for (let i = 0; i < assets.length; i++) {
          setLoadingText(`Loading assets...`);
          await new Promise<void>(resolve => setTimeout(resolve, 200));
          Animated.timing(progress, {
            toValue: (i + 1) / (assets.length + lotties.length),
            duration: 100,
            useNativeDriver: false,
          }).start();
        }

        // Then load all animations
        for (let i = 0; i < lotties.length; i++) {
          setLoadingText(`Loading animations...`);
          await new Promise<void>(resolve => setTimeout(resolve, 200));
          Animated.timing(progress, {
            toValue: (assets.length + i + 1) / (assets.length + lotties.length),
            duration: 100,
            useNativeDriver: false,
          }).start();
        }

        setLoading(false);
        setLoadingText('Ready!');
        setTimeout(onLoadComplete, 500);
      } catch (error) {
        console.error('Error loading assets:', error);
        onLoadComplete();
      }
    };

    loadingSequence();
  }, [onLoadComplete, progress]);

  return (
    <View style={styles.preloaderContainer}>
      <ImageBackground
        source={require('../../game-assets/assets/cricket-pitch.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.preloaderContent}>
          <Image 
            source={require('../../game-assets/assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.progressBarContainer}>
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
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
      </ImageBackground>
      {!loading && (
        <View style={styles.preloader}>
          {lotties.map((step, index) => (
            <LottieView key={index} source={step} autoPlay={false} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  preloaderContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  preloaderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  progressBarContainer: {
    width: '80%',
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'LuckiestGuy-Regular',
  },
  preloader: {
    opacity: 0,
  },
});
