import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  ScrollView,
  Pressable,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColors } from '../theme/colors';
import { useRouter } from 'expo-router';

interface Match {
  id: string;
  date: string;
  userScore: number;
  botScore: number;
  result: 'WON' | 'LOST' | 'DRAW';
}

export default function MatchHistoryScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [displayedMatches, setDisplayedMatches] = useState<Match[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 5;

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    // Update displayed matches when matches or currentPage changes
    const startIndex = 0;
    const endIndex = currentPage * matchesPerPage;
    setDisplayedMatches(matches.slice(startIndex, endIndex));
  }, [matches, currentPage]);

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

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('matchHistory');
      setMatches([]);
      setDisplayedMatches([]);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error clearing match history:', error);
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'WON':
        return colors.success;
      case 'LOST':
        return '#f44336';
      default:
        return colors.commentaryText;
    }
  };

  const getResultIcon = (result: string): keyof typeof MaterialIcons.glyphMap => {
    switch (result) {
      case 'WON':
        return 'emoji-events';
      case 'LOST':
        return 'close';
      default:
        return 'remove';
    }
  };

  const formatMatchDate = (dateString: string) => {
    let matchDate: Date;

    // Handle different date formats for backward compatibility
    if (dateString.includes('T') || dateString.includes('Z')) {
      // ISO format (new format)
      matchDate = new Date(dateString);
    } else {
      // Old format (MM/DD/YYYY or similar)
      matchDate = new Date(dateString);
    }

    // Check if date is valid
    if (isNaN(matchDate.getTime())) {
      return dateString; // Return original string if parsing fails
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const matchDay = new Date(
      matchDate.getFullYear(),
      matchDate.getMonth(),
      matchDate.getDate(),
    );

    // For old format dates, use a default time if no time is available
    let time: string;
    if (dateString.includes('T') || dateString.includes(':')) {
      time = matchDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } else {
      time = '00:00'; // Default time for old format dates
    }

    if (matchDay.getTime() === today.getTime()) {
      return `Today ${time}`;
    } else if (matchDay.getTime() === yesterday.getTime()) {
      return `Yesterday ${time}`;
    } else {
      const day = matchDate.getDate().toString().padStart(2, '0');
      const month = matchDate.toLocaleString('en-US', { month: 'short' });
      return `${day}-${month} ${time}`;
    }
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const getTotalStats = () => {
    const won = matches.filter(m => m.result === 'WON').length;
    const lost = matches.filter(m => m.result === 'LOST').length;
    const draw = matches.filter(m => m.result === 'DRAW').length;
    return { won, lost, draw, total: matches.length };
  };

  const hasMoreMatches = displayedMatches.length < matches.length;

  const stats = getTotalStats();

  return (
    <ImageBackground
      source={require('../game-assets/assets/cricket-stadium-dark.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginTop: 35,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              padding: 8,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 20,
              marginRight: 16,
            }}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.textPrimary}
            />
          </Pressable>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'LuckiestGuy-Regular',
              color: colors.textPrimary,
              flex: 1,
            }}
          >
            Match History
          </Text>
          {matches.length > 0 && (
            <Pressable
              onPress={clearHistory}
              style={{
                padding: 8,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 20,
              }}
            >
              <MaterialIcons
                name="delete"
                size={24}
                color={colors.textPrimary}
              />
            </Pressable>
          )}
        </View>

        {/* Stats Section */}
        {matches.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginHorizontal: 16,
              marginBottom: 20,
              backgroundColor: 'rgba(0,0,0,0.8)',
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: colors.success + '25',
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 12,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: colors.success + '40',
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: 'LuckiestGuy-Regular',
                    color: colors.success,
                  }}
                >
                  {stats.won}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 11,
                  color: colors.textSecondary,
                  fontWeight: '600',
                }}
              >
                Won
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: '#f44336' + '25',
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 12,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: '#f44336' + '40',
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: 'LuckiestGuy-Regular',
                    color: '#f44336',
                  }}
                >
                  {stats.lost}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 11,
                  color: colors.textSecondary,
                  fontWeight: '600',
                }}
              >
                Lost
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: colors.commentaryText + '25',
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 12,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: colors.commentaryText + '40',
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: 'LuckiestGuy-Regular',
                    color: colors.commentaryText,
                  }}
                >
                  {stats.draw}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 11,
                  color: colors.textSecondary,
                  fontWeight: '600',
                }}
              >
                Draw
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: colors.primary + '25',
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 12,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: colors.primary + '40',
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: 'LuckiestGuy-Regular',
                    color: colors.primary,
                  }}
                >
                  {stats.total}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 11,
                  color: colors.textSecondary,
                  fontWeight: '600',
                }}
              >
                Total
              </Text>
            </View>
          </View>
        )}

        {/* Match List */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {matches.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 60,
              }}
            >
              <MaterialIcons
                name="sports-cricket"
                size={60}
                color={colors.textTertiary}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  marginTop: 16,
                  textAlign: 'center',
                }}
              >
                No matches played yet
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textTertiary,
                  marginTop: 6,
                  textAlign: 'center',
                }}
              >
                Start playing to see your match history here
              </Text>
            </View>
          ) : (
            <>
              {displayedMatches.map((match, index) => (
                <View
                  key={match.id}
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 12,
                      paddingBottom: 8,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    }}
                  >
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <MaterialIcons
                        name="calendar-today"
                        size={14}
                        color={colors.textSecondary}
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.textSecondary,
                          fontWeight: '500',
                        }}
                      >
                        {formatMatchDate(match.date)}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: getResultColor(match.result) + '20',
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 16,
                      }}
                    >
                      <MaterialIcons
                        name={getResultIcon(match.result)}
                        size={12}
                        color={getResultColor(match.result)}
                        style={{ marginRight: 3 }}
                      />
                      <Text
                        style={{
                          fontSize: 11,
                          fontFamily: 'LuckiestGuy-Regular',
                          color: getResultColor(match.result),
                        }}
                      >
                        {match.result}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 4,
                    }}
                  >
                    <View
                      style={{
                        alignItems: 'center',
                        flex: 1,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        paddingVertical: 12,
                        paddingHorizontal: 8,
                        borderRadius: 10,
                        marginRight: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 28,
                          fontFamily: 'LuckiestGuy-Regular',
                          color:
                            match.result === 'WON'
                              ? colors.success
                              : colors.textPrimary,
                          marginBottom: 3,
                        }}
                      >
                        {match.userScore}
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          color: colors.textSecondary,
                          fontWeight: '600',
                        }}
                      >
                        Your Runs
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: colors.primary + '20',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                        marginHorizontal: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: 'LuckiestGuy-Regular',
                          color: colors.primary,
                        }}
                      >
                        VS
                      </Text>
                    </View>

                    <View
                      style={{
                        alignItems: 'center',
                        flex: 1,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        paddingVertical: 12,
                        paddingHorizontal: 8,
                        borderRadius: 10,
                        marginLeft: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 28,
                          fontFamily: 'LuckiestGuy-Regular',
                          color:
                            match.result === 'LOST'
                              ? '#f44336'
                              : colors.textPrimary,
                          marginBottom: 3,
                        }}
                      >
                        {match.botScore}
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          color: colors.textSecondary,
                          fontWeight: '600',
                        }}
                      >
                        Bot Runs
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

              {/* Load More Button */}
              {hasMoreMatches && (
                <Pressable
                  onPress={loadMore}
                  style={{
                    backgroundColor: colors.primary,
                    marginHorizontal: 20,
                    marginTop: 16,
                    marginBottom: 20,
                    paddingVertical: 14,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                    alignItems: 'center',
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons
                      name="expand-more"
                      size={20}
                      color={colors.background}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        color: colors.background,
                        fontSize: 14,
                        fontFamily: 'LuckiestGuy-Regular',
                      }}
                    >
                      Load More ({matches.length - displayedMatches.length}{' '}
                      remaining)
                    </Text>
                  </View>
                </Pressable>
              )}

              {/* Bottom spacing when no more matches */}
              {!hasMoreMatches && matches.length > 0 && (
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 20,
                    marginTop: 10,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.textTertiary,
                        fontSize: 12,
                        fontWeight: '500',
                      }}
                    >
                      All matches loaded
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
