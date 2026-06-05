import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { GameRole } from '../utils/game/utils';
import { Preloader } from '../components/game/Preloader';
import { HandContainer } from '../components/game/HandContainer';
import { CountdownTimer } from '../components/game/CountdownTimer';
import { RoleModal } from '../components/game/RoleModal';
import { ScoreModal } from '../components/game/ScoreModal';
import { BallCount } from '../components/game/BallCount';
import { NameModal } from '../components/game/NameModal';
import { AnimatedTextStroke } from '../components/game/AnimatedTextStroke';
import { styles } from '../styles/game/app.styles';
import { Player } from '../utils/game/utils';
import getOpponentRuns from '../utils/game/getOpponentsRun';

export default function GamesScreen() {
  const isDarkMode = true;
  const isComponentMounted = useRef(true);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [runs, setRuns] = useState(0);
  const [selectedRuns, setSelectedRuns] = useState(0);
  // Use refs for values that don't need to trigger re-renders
  const ballCountRef = useRef(0);
  const opponentRunsRef = useRef(0);
  const messageRef = useRef('');
  const animatedNumberRef = useRef(0);

  // Keep useState only for values that affect rendering
  const [player, setPlayer] = useState<Player>(Player.USER);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isBallRunning, setBallRunning] = useState(false);
  const [selectionDisabled, setSelectionDisabled] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [isSecondInning, setIsSecondInning] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [showAnimatedText, setShowAnimatedText] = useState(false);

  // Keep these as state since they're used in rendering
  const [ballCount, setBallCount] = useState(0);
  const [opponentRuns, setOpponentRuns] = useState(0);
  const [message, setMessage] = useState('');
  const [animatedNumber, setAnimatedNumber] = useState(0);
  const [finalScores, setFinalScores] = useState({ userScore: 0, botScore: 0 });

  // Randomize background image
  const backgroundImages = [
    require('../game-assets/assets/cricket-stadium-dark.png'),
    require('../game-assets/assets/cricket-pitch.png'),
  ];
  const [backgroundImage] = useState(
    () => backgroundImages[Math.floor(Math.random() * backgroundImages.length)],
  );
  const [score, setScore] = useState<{
    USER: { over: { runs: number; symbol: string }[]; wickets: number };
    BOT: { over: { runs: number; symbol: string }[]; wickets: number };
  }>({
    USER: {
      over: [],
      wickets: 0,
    },
    BOT: {
      over: [],
      wickets: 0,
    },
  });

  useEffect(() => {
    checkUserName();

    // Cleanup function to reset game when component unmounts
    return () => {
      isComponentMounted.current = false;
      if (started) {
        resetGameWithoutSaving();
      }
    };
  }, []);

  // Handle tab focus/blur to reset game when navigating away
  useFocusEffect(
    React.useCallback(() => {
      // Component is focused
      isComponentMounted.current = true;

      return () => {
        // Component is blurred (tab changed)
        if (started) {
          resetGameWithoutSaving();
        }
      };
    }, [started]),
  );

  const checkUserName = async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName');
      if (!storedName) {
        setShowNameModal(true);
      } else {
        setUserName(storedName);
      }
    } catch (error) {
      console.error('Error checking user name:', error);
    }
  };

  const handleNameSet = useCallback(() => {
    setShowNameModal(false);
    checkUserName();
  }, []);

  // Memoize score calculations to avoid recalculating on every render
  const gameStats = useMemo(() => {
    const botDone =
      score[Player.BOT].over.length >= 6 || score[Player.BOT].wickets >= 1;
    const userDone =
      score[Player.USER].over.length >= 6 || score[Player.USER].wickets >= 1;
    const userScore = score[Player.USER].over.reduce(
      (total, over) => total + over.runs,
      0,
    );
    const botScore = score[Player.BOT].over.reduce(
      (total, over) => total + over.runs,
      0,
    );

    return { botDone, userDone, userScore, botScore };
  }, [score]);

  useEffect(() => {
    const { botDone, userDone, userScore, botScore } = gameStats;

    console.log('Game state check:', {
      botDone,
      userDone,
      userScore,
      botScore,
      isSecondInning,
      player,
      started,
    });

    // Only check game end conditions if game has started
    if (!started) return;

    // Both innings complete - show result
    if (botDone && userDone) {
      console.log('Both innings complete - showing result');
      setTimeout(showResult, 2000);
      return;
    }

    // Second inning - check for early win/loss
    if (isSecondInning) {
      const currentPlayerDone =
        score[player].over.length >= 6 || score[player].wickets >= 1;

      // Current player finished their innings
      if (currentPlayerDone) {
        console.log(
          'Current player finished innings in second inning - showing result',
        );
        setTimeout(showResult, 2000);
        return;
      }

      // Early win condition - target achieved or impossible to achieve
      if (player === Player.USER && userScore > botScore) {
        console.log('User won early - showing result');
        setTimeout(showResult, 2000);
        return;
      }

      if (player === Player.BOT && botScore > userScore) {
        console.log('Bot won early - showing result');
        setTimeout(showResult, 2000);
        return;
      }
    } else {
      // First inning complete - change innings
      if (score[player].over.length >= 6 || score[player].wickets >= 1) {
        console.log('First inning complete - changing innings');
        changeInnings();
      }
    }
  }, [gameStats, isSecondInning, player, score, started]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (showRoleModal) {
      // Ensure timer is stopped when role modal is shown
      setIsTimerActive(false);
      setBallRunning(false);
      setSelectionDisabled(true);

      timeoutId = setTimeout(() => {
        setShowRoleModal(false);
        if (started) {
          // Start the game after role modal closes
          setSelectionDisabled(false);
          setBallRunning(true);
          setIsTimerActive(true);
        }
      }, 3000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showRoleModal, started]);

  useEffect(() => {
    console.log('showScoreModal state changed:', showScoreModal);
  }, [showScoreModal]);

  const saveMatchResult = useCallback(async () => {
    try {
      const { userScore, botScore } = gameStats;
      const result =
        userScore > botScore ? 'WON' : userScore < botScore ? 'LOST' : 'DRAW';

      const match = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        userScore,
        botScore,
        result,
      };

      const storedMatches = await AsyncStorage.getItem('matchHistory');
      const matches = storedMatches ? JSON.parse(storedMatches) : [];
      matches.unshift(match);
      await AsyncStorage.setItem('matchHistory', JSON.stringify(matches));
    } catch (error) {
      console.error('Error saving match result:', error);
    }
  }, [gameStats]);

  const showResult = useCallback(() => {
    console.log('showResult called - setting modal to true');

    // Calculate final scores before stopping the game
    const { userScore, botScore } = gameStats;
    console.log('Final scores calculated:', { userScore, botScore });
    setFinalScores({ userScore, botScore });

    // Ensure game is properly stopped before showing result
    setIsTimerActive(false);
    setBallRunning(false);
    setSelectionDisabled(true);
    setStarted(false);

    // Use setTimeout to ensure state updates complete before showing modal
    setTimeout(() => {
      setShowScoreModal(true);
    }, 100);

    saveMatchResult();
  }, [saveMatchResult, gameStats]);
  const changeInnings = useCallback(() => {
    setIsSecondInning(true);
    setPlayer(prev => (prev === Player.USER ? Player.BOT : Player.USER));
    setShowRoleModal(true);
  }, []);

  const handlePressButton = useCallback(
    (currentRun: number) => {
      if (!started || !isTimerActive || selectedRuns > 0) return;
      setSelectedRuns(currentRun);
      setSelectionDisabled(true);
    },
    [started, isTimerActive, selectedRuns],
  );

  const handleStart = useCallback(() => {
    setStarted(true);
    const randomPlayer = Math.random() < 0.5 ? Player.BOT : Player.USER;
    setPlayer(randomPlayer);
    setShowRoleModal(true);
  }, []);

  const handleWicket = useCallback(() => {
    setMessage('Out!');
    setShowAnimatedText(true);
    setTimeout(() => {
      setShowAnimatedText(false);
    }, 4000);
    setAnimatedNumber(7);
    setScore(prevScore => {
      const updatedOver = [...prevScore[player].over, { runs: 0, symbol: 'w' }];
      const updatedPlayerScore = {
        ...prevScore[player],
        wickets: prevScore[player].wickets + 1,
        over: updatedOver,
      };
      return {
        ...prevScore,
        [player]: updatedPlayerScore,
      };
    });
  }, [player]);

  const handleRuns = useCallback(
    (runs: number) => {
      setAnimatedNumber(runs);
      setShowAnimatedText(true);
      setTimeout(() => {
        setShowAnimatedText(false);
      }, 4000);

      const message =
        player === Player.USER
          ? `You hit ${runs} run${runs > 1 ? 's' : ''}`
          : `Bot hit ${runs} run${runs > 1 ? 's' : ''}`;
      setMessage(message);
      setTimeout(() => {
        setScore(prevScore => {
          const updatedOver = [
            ...prevScore[player].over,
            {
              runs,
              symbol: runs.toString(),
            },
          ];

          const updatedPlayerScore = {
            ...prevScore[player],
            over: updatedOver,
          };

          return {
            ...prevScore,
            [player]: updatedPlayerScore,
          };
        });
      }, 1500);
    },
    [player],
  );

  const handleTimerComplete = useCallback(() => {
    const opponentRuns = getOpponentRuns(player === Player.BOT);
    if (selectedRuns < 1) {
      setSelectionDisabled(true);
    }
    setBallRunning(false);
    setIsTimerActive(false);
    setOpponentRuns(opponentRuns);
    setRuns(selectedRuns);
    setBallCount(prev => prev + 1);

    if (selectedRuns !== opponentRuns) {
      handleRuns(player === Player.USER ? selectedRuns : opponentRuns);
    } else {
      setTimeout(handleWicket, 1000);
    }

    const timeoutId = setTimeout(() => {
      if (started) {
        setSelectedRuns(0);
        setSelectionDisabled(false);
        setBallRunning(true);
        setIsTimerActive(true);
      }
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [player, selectedRuns, started, handleRuns, handleWicket]);
  const resetScore = useCallback(() => {
    setScore({ USER: { over: [], wickets: 0 }, BOT: { over: [], wickets: 0 } });
  }, []);

  const resetGameWithoutSaving = useCallback(() => {
    setStarted(false);
    setBallCount(0);
    setRuns(0);
    setSelectedRuns(0);
    setOpponentRuns(0);
    setMessage('');
    resetScore();
    setShowScoreModal(false);
    setIsSecondInning(false);
    setPlayer(Player.USER);
    setShowRoleModal(false);
    setSelectionDisabled(true);
    setBallRunning(false);
    setIsTimerActive(false);
    setShowAnimatedText(false);
    setAnimatedNumber(0);
  }, [resetScore]);
  const handlePlayAgain = useCallback(() => {
    setShowScoreModal(false);
    setStarted(false);
    setBallCount(0);
    setRuns(0);
    setSelectedRuns(0);
    setOpponentRuns(0);
    setMessage('');
    resetScore();
    setIsSecondInning(false);
    setPlayer(Player.USER);
    setShowRoleModal(false);
    setSelectionDisabled(true);
    setBallRunning(false);
    setIsTimerActive(false);
    setShowAnimatedText(false);
    setAnimatedNumber(0);
    setFinalScores({ userScore: 0, botScore: 0 });
  }, [resetScore]);

  // Memoize button rows to prevent unnecessary re-renders
  const buttonRowTop = useMemo(
    () => (
      <View style={styles.buttonRow}>
        {[1, 2, 3].map(item => (
          <Pressable
            onPress={() => handlePressButton(item)}
            style={[
              styles.button,
              selectionDisabled && styles.buttonDisabled,
              selectedRuns === item && selectionDisabled && styles.selectedBtn,
            ]}
            key={item}
          >
            <View>
              <Text
                style={[
                  styles.buttonText,
                  selectedRuns === item &&
                    selectionDisabled &&
                    styles.selectedBtnText,
                ]}
              >
                {item}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    ),
    [selectionDisabled, selectedRuns, handlePressButton],
  );

  const buttonRowBottom = useMemo(
    () => (
      <View style={styles.buttonRow}>
        {[4, 5, 6].map(item => (
          <Pressable
            onPress={() => handlePressButton(item)}
            style={[
              styles.button,
              selectionDisabled && styles.buttonDisabled,
              selectedRuns === item && selectionDisabled && styles.selectedBtn,
            ]}
            key={item}
          >
            <View>
              <Text
                style={[
                  styles.buttonText,
                  selectedRuns === item &&
                    selectionDisabled &&
                    styles.selectedBtnText,
                ]}
              >
                {item}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    ),
    [selectionDisabled, selectedRuns, handlePressButton],
  );

  // Memoize RoleModal target calculation
  const roleModalTarget = useMemo(() => {
    return score[Player.USER].over.length || score[Player.BOT].over.length
      ? score[player !== Player.USER ? Player.USER : Player.BOT].over.reduce(
          (total, over) => total + over.runs,
          0,
        ) + 1
      : 0;
  }, [score, player]);

  // Memoize history button to prevent re-renders
  const historyButton = useMemo(
    () =>
      !started && (
        <Pressable
          style={[styles.historyButton]}
          onPress={() => router.push('/match-history')}
        >
          <Text style={styles.historyButtonText}>Match History</Text>
        </Pressable>
      ),
    [started, router],
  );

  if (isLoading) {
    return <Preloader onLoadComplete={() => setIsLoading(false)} />;
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView
        style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.2)' }]}
      >
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />
        <View style={{ alignItems: 'center', top: 80, padding: 12 }}>
          {userName && !started && (
            <Text style={[styles.overlayText, { fontSize: 16, marginTop: 10 }]}>
              Welcome, {userName}!
            </Text>
          )}
        </View>
        {started && (
          <BallCount
            userBalls={score[Player.USER].over}
            botBalls={score[Player.BOT].over}
            username={userName}
          />
        )}
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.content}>
            <View style={styles.handContainer}>
              <HandContainer
                runs={runs}
                ballCount={ballCount}
                ballRunning={isTimerActive || isBallRunning}
                started={started}
              />
              <HandContainer
                runs={opponentRuns}
                inverted={true}
                ballCount={ballCount}
                ballRunning={isTimerActive || isBallRunning}
                started={started}
              />
            </View>
          </View>
        </ScrollView>
        {started ? (
          <View style={styles.buttonContainer}>
            {started && (
              <CountdownTimer
                duration={3}
                isActive={isTimerActive}
                onFinish={handleTimerComplete}
              />
            )}

            {(message || isTimerActive) && (
              <View style={styles.commentry}>
                <Text style={styles.commentryText}>
                  {isTimerActive
                    ? 'Pick a number before timer runs out'
                    : message}
                </Text>
              </View>
            )}

            {buttonRowTop}
            {buttonRowBottom}
          </View>
        ) : (
          <LinearGradient
            colors={['black', 'transparent']}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            style={{ paddingTop: 40 }}
          >
            <View style={[styles.buttonContainer]}>
              <View style={[styles.buttonRow]}>
                <Pressable onPress={handleStart} style={[styles.button]}>
                  <Text style={[styles.buttonText]}>Play</Text>
                </Pressable>
              </View>
            </View>
          </LinearGradient>
        )}
        <RoleModal
          visible={showRoleModal}
          role={player === Player.USER ? GameRole.Batting : GameRole.Bowling}
          target={roleModalTarget}
        />
        <ScoreModal
          visible={showScoreModal}
          userScore={finalScores.userScore}
          botScore={finalScores.botScore}
          onClose={handlePlayAgain}
        />

        <NameModal visible={showNameModal} onNameSet={handleNameSet} />

        <AnimatedTextStroke
          visible={showAnimatedText}
          number={animatedNumber}
          isUserBatting={player === Player.USER}
        />
        {historyButton}
      </SafeAreaView>
    </ImageBackground>
  );
}
