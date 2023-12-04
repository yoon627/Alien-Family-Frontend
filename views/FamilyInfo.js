import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import AlienModal from "../components/AlienModal";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height * 0.7;
const ALIEN_SIZE = 80;
const DIFF_WIDTH = SCREEN_WIDTH - ALIEN_SIZE;
const DIFF_HEIGHT = SCREEN_HEIGHT - ALIEN_SIZE;
const RANDOM_WIDTH = Math.random() * DIFF_WIDTH;
const RANDOM_HEIGHT = Math.random() * DIFF_HEIGHT;

export default function FamilyInfo({ navigation }) {
  
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
  const [Family, setFamily] = useState({});
  const isUnmountedRef = useRef(false);
  const animations = useRef([]);
  const FAMILY_MEMBER_CNT = useRef(0);
  const [isLoading, setIsLoading] = useState(true);

  // 모달
  const [selectedAlien, setSelectedAlien] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleImageClick = (alien) => {
    setSelectedAlien(alien);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      isUnmountedRef.current = false;
      startAnimations();
      return () => {
        isUnmountedRef.current = true;
      };
    }, [])
  );

  // 가족정보
  useEffect(() => {
    const viewFamily = async () => {
      try {
        const resp = await AsyncStorage.getItem("myDB");
        setFamily(JSON.parse(resp) || {});
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    viewFamily();
  }, []);

  useEffect(() => {
    updateFamilyData();
  }, [Family]);

  const updateFamilyData = async () => {
    FAMILY_MEMBER_CNT.current = Object.keys(Family).length;
    console.log("Family Length:", FAMILY_MEMBER_CNT.current);
    const newAnimations = Array.from(
      { length: FAMILY_MEMBER_CNT.current },
      createAnimation
    );
    animations.current = newAnimations;
    startAnimations();
  };

  // alien 애니메이션
  const createAnimation = () => {
    console.log("createAnimation");
    return {
      translateX: new Animated.Value(RANDOM_WIDTH),
      translateY: new Animated.Value(RANDOM_HEIGHT),
    };
  };

  const startAnimations = () => {
    console.log("startAnimations");
    animations.current.forEach((animation) => moveTarget(animation));
  };

  const moveTarget = (animation) => {
    // console.log(animation);

    if (!isUnmountedRef.current) {
      const randomX = Math.random() * (SCREEN_WIDTH - ALIEN_SIZE);
      const randomY = Math.random() * (SCREEN_HEIGHT - ALIEN_SIZE);
      const randomDuration = Math.random() * 501 + 4500;
      // console.log("moveBall");

      Animated.parallel([
        Animated.timing(animation.translateX, {
          toValue: randomX,
          duration: randomDuration,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(animation.translateY, {
          toValue: randomY,
          duration: randomDuration,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]).start(({ finished }) => {
        if (finished && !isUnmountedRef.current) {
          bounceOffEdges(animation);
        }
      });
    }
  };

  const bounceOffEdges = (animation) => {
    // console.log("bounceOffEdges");
    if (!isUnmountedRef.current) {
      Animated.parallel([
        Animated.timing(animation.translateX, {
          toValue: animation.translateX._value <= 0 ? 1 : animation.translateX._value >= DIFF_WIDTH ? DIFF_WIDTH - 1 : animation.translateX._value,
          duration: 0, 
          useNativeDriver: false,
        }),
        Animated.timing(animation.translateY, {
          toValue: animation.translateY._value <= 0 ? 1 : animation.translateY._value >= DIFF_HEIGHT ? DIFF_HEIGHT - 1 : animation.translateY._value,
          duration: 0,
          useNativeDriver: false,
        }),
      ]).start(({ finished }) => {
        if (finished && !isUnmountedRef.current) {
          moveTarget(animation);
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/img/galaxyBg.jpg")}
        imageStyle={{
          resizeMode: "cover",
          height: Dimensions.get("window").height,
          width: SCREEN_WIDTH,
        }}
      >
        {Object.keys(Family).map((memberId, index) => (
          <View key={index}>
            <Animated.View
              style={[
                {
                  transform: [
                    {
                      translateX:
                        animations.current[index]?.translateX || RANDOM_WIDTH,
                    },
                    {
                      translateY:
                        animations.current[index]?.translateY || RANDOM_HEIGHT,
                    },
                  ],
                },
              ]}
            >
              <View style={styles.alien}>
                <TouchableOpacity onPress={() => handleImageClick(Family[memberId])}>
                    <Text style={styles.nickname}>{Family[memberId].nickname}</Text>
                    <Image style={styles.image} source={alienImagePath[Family[memberId].alien.type]} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        ))}
        {/* 모달 */}
        <AlienModal
          visible={isModalVisible}
          onClose={closeModal}
          alienInfo={selectedAlien}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  alien: {
    width: ALIEN_SIZE - 5,
    justifyContent: "center",
    alignItems: "center",
  },
  nickname: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
    marginBottom: 8,

    fontWeight: "700",
  },

  image: {
    width: ALIEN_SIZE,
    height: ALIEN_SIZE,
    resizeMode: "contain",
  },
});
