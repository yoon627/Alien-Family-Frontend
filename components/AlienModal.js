import React, { useState, useEffect } from 'react';
import { ImageBackground } from 'react-native';
import { Modal, View, Text, Image, TouchableOpacity, Dimensions, Animated, StyleSheet } from 'react-native';
const SCREEN_WIDTH = Dimensions.get('window').width ;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const AlienModal = ({ visible, onClose, alienInfo }) => {

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
    SANTA : require(`../assets/img/character/SANTA.png`),
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

  return (
    
    
    <Modal transparent={true} animationType="none" visible={visible} onRequestClose={onClose}>
      <View style={styles.container}>
        <Animated.View
          style={{ ...styles.subContainer, transform: [{ translateX: slideAnim }] }}>

          <ImageBackground source={require("../assets/img/alienCard.png")} style={styles.alienCard} >
            {alienInfo && (
              <>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={{fontSize: 20, padding: 5, paddingHorizontal: 10}}>X</Text>
              </TouchableOpacity>
              <View style={styles.imageBox}>
                <Image style={styles.image} source={alienImagePath[alienInfo.alien.type]} />
              </View>
              <View style={styles.txtBox}>
                <View style={{...styles.subtitleContainer, }}>
                  {/*<Text style={styles.subtitle}>이름 : </Text>*/}
                  <Text style={{...styles.subtitleContent, marginBottom: 10, fontFamily: "dnf", }}>{alienInfo.name} ({alienInfo.nickname})</Text>
                </View>
                {/*<View style={styles.subtitleContainer}>*/}
                {/*  <Text style={styles.subtitle}>별명 : </Text>*/}
                {/*  <Text style={styles.subtitleContent}>{alienInfo.nickname}</Text>*/}
                {/*</View>*/}
                <View style={styles.subtitleContainer}>
                  {/*<Text style={styles.subtitle}>역할: </Text>*/}
                  <Text style={styles.subtitleContent}>{alienInfo.familyRole}</Text>
                </View>
                <View style={styles.subtitleContainer}>
                  {/*<Text style={styles.subtitle}>이메일: </Text>*/}
                  <Text style={styles.subtitleContent}>{alienInfo.email}</Text>
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
  container:{
    flex:1,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    
  },
  subContainer:{
    height: SCREEN_HEIGHT/2.29,
    width: SCREEN_WIDTH/1.5,
  },
  alienCard:{
    alignItems: 'center',
    resizeMode: "contain",
    width: '100%',
    height: '100%',
    paddingTop: 30
  },
  imageBox:{
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
  txtBox:{
    marginTop: 20,
    borderRadius: 10,
    // paddingLeft: 30,
    width: '100%'
  },
  subtitleContainer:{
    justifyContent: "center",
    // paddingHorizontal: 10,
    flexDirection: 'row',
    marginBottom: 4,
  },
  subtitle:{
    fontWeight: '700',
    fontSize: 19,
  },
  subtitleContent:{
    fontSize: 18,
  },
  closeBtn:{
    position: 'absolute',
    top: '4%',
    right: '5.5%',
    backgroundColor: '#FFF',
    // margin: 16,
    // marginRight: 18,
  }
})
export default AlienModal;
