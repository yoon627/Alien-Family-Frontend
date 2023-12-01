import React, { useCallback } from 'react';
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveServer = async () => {
  try {
    await AsyncStorage.setItem('ServerAddress', 'http://43.202.241.133:12345');
    await AsyncStorage.setItem(
      'FcmServerKey',
      'AAAAUCMBJiU:APA91bEs9fOJNe6l2ILHFI88jep5rw9wqR-qTWWbBrKxj7JQnKQ8ZAp4tJbn_yXcL2aP0ydygPIcT89XB6h38vhIozsJ5J61s7w2znBL9hPQG6a18sQcUFkMitr2pkvoCmmfslVQmk-u'
    );
  } catch (error) {
    console.log(error);
  }
};

const getData = async () => {
  try {
    const token = await AsyncStorage.getItem('UserServerAccessToken');
  } catch (error) {
    console.error('Error getMsg:', error);
  }
};

getData();

const Login = ({ navigation }) => {
  saveServer();
  return (
    <ImageBackground
      source={require('../assets/img/loginScreen.png')}
      style={styles.backgroundImage}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 7 }} />
        <View
          style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 40,
              lineHeight: 40,
              marginTop: 20,
            }}>
            ALIEN
          </Text>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 40,
              lineHeight: 40,
            }}>
            FAMILY
          </Text>
          <Text style={{ color: 'white', marginVertical: 10 }}>
            당신의 가족을 찾아보세요!
          </Text>
        </View>
        <View
          style={{
            flex: 1.5,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 3,
          }}>
          <View style={{ overflow: 'hidden', borderRadius: 15, width: 175 }}>
            <ImageBackground source={require('../assets/img/pinkBtn.png')}>
              <TouchableOpacity
                onPress={async () => {
                  const test = await AsyncStorage.getItem(
                    'UserServerAccessToken'
                  );
                  if (test) {
                    navigation.navigate('MainDrawer');
                  } else {
                    Alert.alert('회원가입해주세요');
                  }
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'black',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'white',
                    marginHorizontal: 20,
                    marginVertical: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                  }}>
                  Start!
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('KaKaoLogin')}
            style={{
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                marginHorizontal: 30,
                marginVertical: 15,
                alignItems: 'center',
                justifyContent: 'center',
                textDecorationLine: 'underline',
              }}>
              카카오계정으로 회원가입
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // 또는 'contain' 등 이미지 사이즈 조정
  },
});

export default Login;
