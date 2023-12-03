import React, { useState, useEffect } from 'react';
import { ImageBackground } from 'react-native';
import { Modal, View, Text, Image, TouchableOpacity, Dimensions, Animated, StyleSheet } from 'react-native';
const SCREEN_WIDTH = Dimensions.get('window').width ;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const AlienModal = ({ visible, onClose, alienInfo }) => {

  const slideAnim = new Animated.Value(SCREEN_WIDTH);

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
                <Text style={{fontSize: 20, padding: 5, paddingHorizontal: 14}}>X</Text>
              </TouchableOpacity>
              <View style={styles.imageBox}>
                <Image style={styles.image} source={require("../assets/img/alien4.png")} />
              </View>
              <View style={styles.txtBox}>
                <View style={styles.subtitleContainer}>
                  <Text style={styles.subtitle}>Name : </Text>
                  <Text style={styles.subtitleContent}>{alienInfo.name}</Text>
                </View>
                <View style={styles.subtitleContainer}>
                  <Text style={styles.subtitle}>Nickname : </Text>
                  <Text style={styles.subtitleContent}>{alienInfo.nickname}</Text>
                </View>
                <View style={styles.subtitleContainer}>
                  <Text style={styles.subtitle}>Email : </Text>
                  <Text style={styles.subtitleContent}>{alienInfo.email}</Text>
                </View>
                <View style={styles.subtitleContainer}>
                  <Text style={styles.subtitle}>FamilyRole : </Text>
                  <Text style={styles.subtitleContent}>{alienInfo.familyRole}</Text>
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
    // right: 0,
    // position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // alignItems: 'stretch',
    
    // justifyContent: 'flex-end',
    // alignItems: 'flex-end',
    // alignContent: 'flex-end',
    
    // alignItems: 'flex-end',
    // alignContent: 'flex-end',
    
    
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
    // width: 120,
    // height: 120,
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
    borderWidth: 10,
    borderRadius: 100,
    borderColor: '#FFF',

  },
  txtBox:{
    marginTop: 20,
    borderRadius: 10,
    paddingLeft: 30,
    width: '100%'

  },
  subtitleContainer:{
    flexDirection: 'row',
    marginBottom: 4
  },
  subtitle:{
    fontSize: 18,
    color: '#FFF',
  },

  subtitleContent:{
    fontSize: 18,
    color: '#FFF',
    
  },
  closeBtn:{
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFF',
    margin: 16,
    marginRight: 20,
    // marginTop: 25,
    // marginRight: 10

  }
})
export default AlienModal;
