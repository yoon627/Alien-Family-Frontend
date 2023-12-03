import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useRef, } from "react";
import { View, Text, StyleSheet, Image, Animated, Dimensions, Easing, ImageBackground, } from "react-native";

import { useFocusEffect } from '@react-navigation/native';


const SCREEN_WIDTH = Dimensions.get('window').width ;
const SCREEN_HEIGHT = Dimensions.get('window').height * 0.7;
const ALIEN_SIZE = 80;
const DIFF_WIDTH = SCREEN_WIDTH - ALIEN_SIZE;
const DIFF_HEIGHT = SCREEN_HEIGHT - ALIEN_SIZE;
const RANDOM_WIDTH = Math.random() * (DIFF_WIDTH);
const RANDOM_HEIGHT = Math.random() * (DIFF_HEIGHT);



export default function FamilyInfo({ navigation }) {

  const [Family, setFamily] = useState({});
  const isUnmountedRef = useRef(false);
  const animations = useRef([]);
  const FAMILY_MEMBER_CNT = useRef(0);
  const [isLoading, setIsLoading] = useState(true);

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
    const newAnimations = Array.from({ length: FAMILY_MEMBER_CNT.current }, createAnimation);
    animations.current = newAnimations;
    startAnimations()
  };


  // alien 애니메이션
  const createAnimation = () => {
    console.log("createAnimation");    
    return {
      translateX: new Animated.Value(RANDOM_WIDTH),
      translateY: new Animated.Value(RANDOM_HEIGHT)};
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
          toValue: animation.translateX._value <= 0 ? 1 : animation.translateX._value >= DIFF_WIDTH - 5 ? DIFF_WIDTH - 1 : animation.translateX._value,
          duration: 0, 
          useNativeDriver: false,
        }),
        Animated.timing(animation.translateY, {
          toValue: animation.translateY._value <= 0 ? 1 : animation.translateY._value >= DIFF_HEIGHT - 5 ? DIFF_HEIGHT - 1 : animation.translateY._value,
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
        imageStyle={{resizeMode: 'cover', height:  Dimensions.get('window').height , width: SCREEN_WIDTH }}
      >
        {animations.current.map((animation, index) => (
          <Animated.View key={index} style={[{transform: [
                {translateX: animation.translateX },
                {translateY: animation.translateY}]}
          ]}>

            {Object.keys(Family).map((alienKey, index) => (

              <View style={styles.alien}>

                <Text style={styles.nickname}>{Family[alienKey].nickname}</Text>
                {/* createAt, modifiedAt, memberId, name, email, picture, role, nickname, familyRole, birthdate, roleKey */}
                <Image style={styles.image} source={require("../assets/img/alien4.png")} />

              </View>
            ))}
          </Animated.View>
        ))}
      </ImageBackground>
    </View>
    
  );
}


const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  alien:{
    width: ALIEN_SIZE -5 ,
    justifyContent: 'center',
    alignItems: 'center'

  },
  nickname: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    
    fontWeight: '700',
  },
  
  image: {
    width: ALIEN_SIZE,
    height: ALIEN_SIZE,
    resizeMode: "contain",
  },
});
