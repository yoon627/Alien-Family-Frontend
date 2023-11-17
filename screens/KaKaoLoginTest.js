import React from 'react';
import { View, Button } from 'react-native';
import KakaoLogins from '@react-native-seoul/kakao-login';

const KaKaoLoginTest = () => {
  const onKakaoLogin = async () => {
    try {
      const result = await KakaoLogins.login();
      console.log('Kakao Login Result:', result);
    } catch (error) {
      console.error('Kakao Login Error:', error);
    }
  };

  const onKakaoLogout = async () => {
    try {
      await KakaoLogins.logout();
      console.log('Kakao Logout Success');
    } catch (error) {
      console.error('Kakao Logout Error:', error);
    }
  };

  return (
    <View>
      <Button title="Kakao Login" onPress={onKakaoLogin} />
      <Button title="Kakao Logout" onPress={onKakaoLogout} />
    </View>
  );
};

export default KaKaoLoginTest;