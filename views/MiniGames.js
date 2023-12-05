import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  View,
  Text
} from "react-native";
import LottieView from "lottie-react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();
const ALIEN_SIZE = 120;

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height+45;

export default function MiniGames({ navigation }) {
  const [alienType, setAlienType] = useState("BASIC");
  const alienImagePath = {
    BASIC: require(`../assets/img/character/BASIC.png`),
    GLASSES: require(`../assets/img/character/GLASSES.png`),
    GIRL: require(`../assets/img/character/GIRL.png`),
    BAND_AID: require(`../assets/img/character/BAND_AID.png`),
    RABBIT: require(`../assets/img/character/RABBIT.png`),
    HEADBAND: require(`../assets/img/character/HEADBAND.png`),
    TOMATO: require(`../assets/img/character/TOMATO.png`),
    CHRISTMAS_TREE: require(`../assets/img/character/CHRISTMAS_TREE.png`),
    SANTA : require(`../assets/img/character/SANTA.png`),
    PIRATE: require(`../assets/img/character/PIRATE.png`),
  }
  
  useEffect(() => {
    const fetchAlienType = async () => {
      try {
        setAlienType(await AsyncStorage.getItem("alienType"));

      } catch (error) {
        console.error("Error fetching alienType from AsyncStorage:", error);
      }
    };
    fetchAlienType();
  }, []);

  const [characterPosition, setCharacterPosition] = useState({
    x: 200,
    y: 200,
  });
  const [showButton, setShowButton] = useState({
    ladder: false,
    mole: false,
    roulette: false,
    door: false,
  });

  const SOME_THRESHOLD = 100;
  const joystickPosition = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: joystickPosition.x, dy: joystickPosition.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        Animated.spring(joystickPosition, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    const listener = joystickPosition.addListener((position) => {
      // 이동 감도 조절
      const sensitivity = 0.3; // 조절 가능한 값
      const adjustedPosition = {
        x: position.x * sensitivity,
        y: -position.y * sensitivity,
      };
  
      // 움직임이 발생한 경우에만 로그 및 캐릭터 위치 업데이트
      if (Math.abs(adjustedPosition.x) > 0.01 || Math.abs(adjustedPosition.y) > 0.01) {
        // console.log(adjustedPosition);
        setCharacterPosition((prevPosition) => ({
          x: Math.max(
            0,
            Math.min(prevPosition.x + adjustedPosition.x, SCREEN_WIDTH - SCREEN_WIDTH * 0.12)
          ),
          y: Math.max(
            0,
            Math.min(prevPosition.y - adjustedPosition.y, SCREEN_HEIGHT - SCREEN_HEIGHT * 0.1)
          ),
        }));
      }
    });
  
    return () => {
      // 컴포넌트 언마운트 시 리스너 제거
      joystickPosition.removeListener(listener);
    };
  }, []);
    
    


  // 게임 이미지 & 캐릭터 사이 거리 계산
  const calculateDistance = (pos1, pos2) => {
    return Math.sqrt(
      Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
    );
  };

  useLayoutEffect(() => {
    const gameImgPosition = {
      ladder: { x: SCREEN_WIDTH * 0.007, y: SCREEN_HEIGHT * 0.35 },
      mole: { x: SCREEN_WIDTH * 0.9, y: SCREEN_HEIGHT * 0.44 },
      roulette: { x: SCREEN_WIDTH * 0.01, y: SCREEN_HEIGHT * 0.05 },
      door: { x: SCREEN_WIDTH * 0.7, y: SCREEN_HEIGHT * 0.1 },
    };

    const updatedShowButton = {};

    Object.keys(gameImgPosition).forEach((button) => {
      const distance = calculateDistance(
        characterPosition,
        gameImgPosition[button]
      );
      updatedShowButton[button] = distance < SOME_THRESHOLD;
    });

    setShowButton(updatedShowButton);
  }, [characterPosition]);

  return (
    <View style={styles.container}>
      <ImageBackground
          source={require("../assets/img/gameMap.png")}                
          imageStyle={{resizeMode: 'cover', height:  SCREEN_HEIGHT , width: SCREEN_WIDTH}}
        >
          {/* 조이스틱 */}
        <View style={styles.joystickArea}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[joystickPosition.getLayout(), styles.joystick]}
          />
        </View>
      
        

        {/* 문 */}
        <View>
        {showButton.door ? (
          <TouchableOpacity
            onPress={() => {
              Alert.alert("맵을 나가시겠습니까?", null, [
                {
                  text: "취소",
                  style: "cancel",
                },
                {
                  text: "나가기",
                  onPress: () => {
                    navigation.navigate("Home");
                  },
                },
              ]);
            }}
          >
            <Image
              style={styles.clickImage}
              source={require("../assets/img/door.png")}
            />
          </TouchableOpacity>
        ) : null}
</View>

            
        {/* 사다리 */}
        <View>
        {showButton.ladder ? (
          <TouchableOpacity
            onPress={() => { navigation.navigate("Ladder");}}
          >
            <Image
              style={styles.clickImage}
              source={require("../assets/img/ladder.png")}
            />
          </TouchableOpacity>
        ) : null}
        </View>


        {/* 두더지 */}
        <View>
        {showButton.mole ? (
          <TouchableOpacity
            onPress={() => { navigation.navigate("Mole");}}
          >
            <Image
              style={styles.clickImage}
              source={require("../assets/img/mole.png")}
            />
          </TouchableOpacity>
        ) : null}
        </View>

        {/* 룰렛 */}
        <View>
        {showButton.roulette ? (
          <TouchableOpacity 
            onPress={() => { navigation.navigate("Roulette"); }}
          >
            <Image
              style={styles.clickImage}
              source={require("../assets/img/roulette.png")}
            />
          </TouchableOpacity>
        ) : null}
        </View>

        <View
          style={{
            position: "absolute",
            left: characterPosition.x,
            top: characterPosition.y,
          }}
        >
          <Image style={styles.image} source={alienImagePath[alienType]} />
        </View>
        

      </ImageBackground>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  
  clickImage: {
    position: "absolute",
    right: SCREEN_WIDTH * 0.05,
    top: SCREEN_HEIGHT * 0.83,
    width: SCREEN_WIDTH*0.2,
    height: SCREEN_HEIGHT *0.15,
    resizeMode: "contain",
  },

  joystickArea: {
    position: "absolute",
    left: SCREEN_WIDTH * 0.1,
    top: SCREEN_HEIGHT * 0.8,
    backgroundColor: 'gray',
    borderColor: 'gray',
    borderWidth: 13,
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.3,
    borderRadius: (SCREEN_WIDTH * 0.3) / 2,
    justifyContent: 'center',
    alignItems: 'center',

  },
  joystick: {
    width: SCREEN_WIDTH * 0.13,
    height: SCREEN_WIDTH * 0.13,
    borderRadius: (SCREEN_WIDTH * 0.13) / 2,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    
  },
  alien: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.08,
    resizeMode: "contain",
  },
  image: {
    width: ALIEN_SIZE,
    height: ALIEN_SIZE,
    resizeMode: "contain",
  },
  
});
