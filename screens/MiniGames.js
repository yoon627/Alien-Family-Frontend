import React, { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, Button, StyleSheet, View, Image, Animated, Dimensions, ImageBackground, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import LottieView from 'lottie-react-native';
import AlienSvg from '../AlienSvg';
import { KorolJoystick } from "korol-joystick";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function MiniGames({ navigation }) {
  const [characterPosition, setCharacterPosition] = useState({ x: 200, y: 200 });

  const handlePress = () => {
    navigation.navigate("Roulette");
  };

  // 캐릭터 이동시키는 로직
  const handleJoystickMove = (e) => {
    // 각도를 이용하여 이동 방향 계산
    const angleInRadian = e.angle.radian;
    const deltaX = e.force * Math.cos(angleInRadian) * 4;
    const deltaY = e.force * Math.sin(angleInRadian) * 4;

    // 현재 캐릭터 위치에서 이동
    setCharacterPosition((prevPosition) => ({
      x: Math.max(0, Math.min(prevPosition.x + deltaX, SCREEN_WIDTH - SCREEN_WIDTH * 0.12)),
      y: Math.max(0, Math.min(prevPosition.y - deltaY, SCREEN_HEIGHT - SCREEN_HEIGHT * 0.1)),
    }));
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        // source={{ uri: "https://i.pinimg.com/564x/1a/9f/fa/1a9ffa739e7eb822606f7d8f74d14c26.jpg" }}
        style={styles.bgImage}
      >
        <View style={styles.doorForm}>
          <TouchableOpacity onPress={
            () => navigation.navigate("Home")
          }>
            <Image
              style={styles.door}
              source={require('../assets/img/door.png')} />
          </TouchableOpacity>
        </View>

        <View style={styles.ladderForm}>
          <TouchableOpacity onPress={
            () => navigation.navigate("Ladder")
          }>
            <Image
              style={styles.ladder}
              source={require('../assets/img/ladder.png')}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.moleForm}>
          <TouchableOpacity onPress={
            () => navigation.navigate("Mole")
          }>
            <Image
              style={styles.mole}
              source={require('../assets/img/mole.png')}
            />
          </TouchableOpacity>
        </View>

        <GestureHandlerRootView
          style={styles.joystick}
        >
          <KorolJoystick
            color="#FFFFFF"
            radius={70}
            onMove={handleJoystickMove}
          />
        </GestureHandlerRootView>

        <Animated.View/>
        <TouchableWithoutFeedback onPress={
          () => navigation.navigate("Roulette")
        }>
            <LottieView
              style={styles.roulette}
              source={require('../assets/json/roulette.json')}
              autoPlay
              loop
            />
        </TouchableWithoutFeedback>
          {/* </Animated.View> */}

        <View style={{
          left: characterPosition.x,
          top: characterPosition.y,
          width: SCREEN_WIDTH * 0.4,
          resizeMode: "contain"
        }}>
          <AlienSvg />
        </View>

        <StatusBar style="auto" />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
  },
  bgImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "#000000",
  },
  alienForm: {},
  alien: {},
  ladderForm: {
    position: "absolute",
    top: -SCREEN_HEIGHT * 0.3,
    left: -SCREEN_WIDTH * 0.025,
  },
  ladder: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT,
    resizeMode: "contain",
  },
  moleForm: {
    position: "absolute",
    bottom: SCREEN_HEIGHT * 0.2,
    right: 10,
  },
  mole: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_HEIGHT,
    resizeMode: "contain",
  },
  roulette: {
    position: "absolute",
    left: SCREEN_WIDTH * 0.15,
    bottom: -SCREEN_HEIGHT * 0.1,
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_HEIGHT,
    resizeMode: "contain",
  },
  joystick: {
    position: "absolute",
    left: 30,
    bottom: 30
  },
  doorForm: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.4,
    right: 0,
  },
  door: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_HEIGHT,
    resizeMode: "contain",
  }
});
