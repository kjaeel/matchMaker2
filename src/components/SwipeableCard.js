import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Animated, Dimensions, Easing } from 'react-native';
import { Text, Chip, Surface } from 'react-native-paper';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;
const CARD_WIDTH = width * 0.9;
const DEFAULT_CARD_HEIGHT = height * 0.5;

export default function SwipeableCard({ profile, onSwipeRight, onSwipeLeft, disabled = false, cardHeight = DEFAULT_CARD_HEIGHT }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Smooth bounce-in animation when new profile appears
    scale.setValue(0.9);
    Animated.spring(scale, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();

    translateX.setValue(0);
    translateY.setValue(0);
    opacity.setValue(1);
  }, [profile?.id]);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (disabled) return;
    const { nativeEvent } = event;

    if (nativeEvent.oldState === State.ACTIVE) {
      const { translationX, velocityX } = nativeEvent;
      const absX = Math.abs(translationX);
      const isFlick = Math.abs(velocityX) > 1000;

      if (absX > SWIPE_THRESHOLD || isFlick) {
        const toValue = translationX > 0 ? width * 1.5 : -width * 1.5;

        Animated.parallel([
          Animated.timing(translateX, {
            toValue,
            duration: 220,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Instantly call parent to load next profile
          if (translationX > 0) {
            onSwipeRight?.(profile.id);
          } else {
            onSwipeLeft?.(profile.id);
          }

          // Reset for reuse
          translateX.setValue(0);
          translateY.setValue(0);
          opacity.setValue(1);
        });
      } else {
        // Not far enough — snap back
        Animated.spring(translateX, {
          toValue: 0,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }).start();
        Animated.spring(translateY, {
          toValue: 0,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const rotate = translateX.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ['-20deg', '0deg', '20deg'],
  });

  const likeOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const passOpacity = translateX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const cardStyle = {
    transform: [{ translateX }, { translateY }, { rotate }, { scale }],
    opacity,
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      enabled={!disabled}
    >
      <Animated.View style={[styles.card, cardStyle, { height: cardHeight }]}>
        <Surface style={styles.surface} elevation={8}>
          <ImageBackground
            source={{ uri: profile.photo }}
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.gradientOverlay}
            >
              {/* LIKE Overlay */}
              <Animated.View style={[styles.overlay, styles.likeOverlay, { opacity: likeOpacity }]}>
                <Icon name="heart" size={80} color="#fff" />
                <Text style={styles.overlayText}>LIKE</Text>
              </Animated.View>

              {/* PASS Overlay */}
              <Animated.View style={[styles.overlay, styles.passOverlay, { opacity: passOpacity }]}>
                <Icon name="close" size={80} color="#fff" />
                <Text style={styles.overlayText}>PASS</Text>
              </Animated.View>

              {/* Profile Info */}
              <View style={styles.profileInfo}>
                <View style={styles.nameRow}>
                  <Text variant="headlineMedium" style={styles.name}>{profile.name}</Text>
                  <Text variant="titleLarge" style={styles.age}>{profile.age}</Text>
                </View>
                <View style={styles.locationRow}>
                  <Icon name="map-marker" size={18} color="#fff" />
                  <Text variant="bodyLarge" style={styles.location}>
                    {profile.city}, {profile.state}
                  </Text>
                </View>
                <View style={styles.chipsRow}>
                  <Chip style={styles.chip} textStyle={styles.chipText}>{profile.religion}</Chip>
                  <Chip style={styles.chip} textStyle={styles.chipText}>{profile.caste}</Chip>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </Surface>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 24,
    overflow: 'hidden',
  },
  surface: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  imageBackground: {
    flex: 1,
    width: '100%',
  },
  imageStyle: { borderRadius: 24 },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeOverlay: { backgroundColor: 'rgba(139,0,0,0.6)' },
  passOverlay: { backgroundColor: 'rgba(220,53,69,0.6)' },
  overlayText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
  },
  profileInfo: { marginTop: 'auto' },
  nameRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 },
  name: { color: '#fff', fontWeight: '700', fontSize: 32, marginRight: 12 },
  age: { color: '#FFD700', fontWeight: '600', fontSize: 24 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  location: { color: '#fff', marginLeft: 6 },
  chipsRow: { flexDirection: 'row', gap: 8 },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.5)',
  },
  chipText: { color: '#fff', fontWeight: '600' },
});