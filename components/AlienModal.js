import React, {useState, useEffect} from 'react';
import {ImageBackground} from 'react-native';
import {Modal, View, Text, Image, TouchableOpacity, Dimensions, Animated, StyleSheet} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const AlienModal = ({visible, onClose, alienInfo}) => {

  const slideAnim = new Animated.Value(SCREEN_WIDTH);
  const alienImagePath = {
    BASIC: require(`../assets/img/character/BASIC.png`),
    GLASSES: require(`../assets/img/character/GLASSES.png`),
    GIRL: require(`../assets/img/character/GIRL.png`),
    BAND_AID: require(`../assets/img/character/BAND_AID.png`),
    RABBIT: require(`../assets/img/character/RABBIT.png`),
    HEADBAND: require(`../assets/img/character/HEADBAND.png`),
    TOMATO: require(`../assets/img/character/TOMATO.png`),
    CHRISTMAS_TREE: require(`../assets/img/character/CHRISTMAS_TREE.png`),
    SANTA: require(`../assets/img/character/SANTA.png`),
    PIRATE: require(`../assets/img/character/PIRATE.png`),
  }

  useEffect(() => {
    if (alienInfo) {
      console.log("Modal Alien Info:", alienInfo);
    }
    // alienInfo가 변경될 때마다 실행됩니다.
  }, [alienInfo]);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  const koFamilyRole = (originalRole) => {
    switch (originalRole) {
      case "DAD":
        return "아빠"
      case "MOM":
        return "엄마"
      case "FIRST":
        return "첫째"
      case "SECOND":
        return "둘째"
      case "THIRD":
        return "셋째"
      case "FOURTH":
        return "넷째"
      case "FIFTH":
        return "다섯째"
      case "SIXTH":
        return "여섯째"
      case "GRANDMOTHER":
        return "할머니"
      case "GRANDFATHER":
        return "할아버지"
      case "UNCLE":
        return "삼촌"
      case "EXTRA":
        return "기타"
      default:
        return originalRole;
    }
  };

  return (
    <Modal transparent={true} animationType="none" visible={visible} onRequestClose={onClose}>
      <View style={styles.container}>
        <Animated.View
          style={{...styles.subContainer, transform: [{translateX: slideAnim}]}}>

          <ImageBackground source={require("../assets/img/alienCard.png")} style={styles.alienCard}>
            {alienInfo && (
              <>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Text style={{fontSize: 20, padding: 5, paddingHorizontal: 10, fontFamily: "doss",}}>X</Text>
                </TouchableOpacity>
                <View style={styles.imageBox}>
                  <Image style={styles.image} source={alienImagePath[alienInfo.alien.type]}/>
                </View>
                <View style={styles.txtBox}>
                  <View style={{...styles.subtitleContainer,}}>
                    <Text
                      style={{...styles.subtitleContent, marginBottom: 10, fontSize: 25,}}
                    >
                      {alienInfo.name}({alienInfo.nickname})
                    </Text>
                  </View>
                  <View style={styles.subtitleContainer}>
                    <Text style={styles.subtitleContent}>{koFamilyRole(alienInfo.familyRole)}</Text>
                  </View>
                  <View style={styles.subtitleContainer}>
                    <Text style={{
                      ...styles.subtitleContent,
                      textDecorationLine: 'underline',
                      textDecorationStyle: 'solid',
                    }}>{alienInfo.email}</Text>
                  </View>
                </View>
              </>
            )}
          </ImageBackground>
        </Animated.View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',

  },
  subContainer: {
    height: SCREEN_HEIGHT / 2.29,
    width: SCREEN_WIDTH / 1.5,
  },
  alienCard: {
    alignItems: 'center',
    resizeMode: "contain",
    width: '100%',
    height: '100%',
    paddingTop: 30
  },
  imageBox: {
    borderRadius: 100,
    alignItems: 'center',
    borderColor: '#FFF',
    borderWidth: 2,
    padding: 3,
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    borderWidth: 5,
    borderRadius: 100,
    borderColor: '#FFF',
  },
  txtBox: {
    marginTop: 20,
    borderRadius: 10,
    // paddingLeft: 30,
    width: '100%'
  },
  subtitleContainer: {
    justifyContent: "center",
    // paddingHorizontal: 10,
    flexDirection: 'row',
    marginBottom: 4,
  },
  subtitle: {
    fontWeight: '700',
    fontSize: 19,
  },
  subtitleContent: {
    fontSize: 18,
    fontFamily: "doss",
    textShadowColor: 'white',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  closeBtn: {
    position: 'absolute',
    top: '5%',
    right: '5%',
    backgroundColor: '#FFF',
    // margin: 16,
    // marginRight: 18,
  }
})
export default AlienModal;
