import axios from "axios";
import React, { useState } from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const FirstRegister = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');
  const [name, setName] = useState('');
  const [birthday, setBirthDay] = useState(new Date());
  const [showBirthDayPicker, setShowBirthDayPicker] = useState(false);

  const onChangeName = (payload) => setName(payload);

  const onBirthDayChange = (event, selected) => {
    const birthDate = selected || birthday;
    if (Platform.OS === 'android') {
      setShowBirthDayPicker(false);
    }
    setBirthDay(birthDate); // Ensure currentDate is a Date object
  };

  function formatYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  return (
    <ImageBackground
      source={require('../assets/img/pinkBtn.png')}
      style={styles.backgroundImage}>
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 30,
            flex: 0.5,
            width: 0.85 * width,
          }}>
          <View
            style={{
              marginTop:35,
              flex: 0.9,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                marginVertical: 5,
                borderRadius: 30,
                paddingHorizontal: 30,
                paddingVertical: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View>
                <TextInput
                  value={name}
                  placeholder="닉네임을 입력해주세요"
                  style={{
                    ...styles.input,
                    borderColor: '#F213A6',
                    borderWidth: 3,
                    marginBottom: 10,
                  }}
                  onChangeText={onChangeName}
                />
              </View>
              <View
                style={{
                  ...styles.input,
                  borderColor: '#F213A6',
                  borderWidth: 3,
                  marginBottom: 20,
                }}>
                <Text style={{ color: 'gray', fontSize: 20 }}>
                  생일을 입력해주세요
                </Text>
                <TouchableOpacity onPress={() => setShowBirthDayPicker(true)}>
                  <View
                    style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'black', fontSize: 23,fontWeight:'bold' }}>
                      {' '}
                      {formatYYYYMMDD(birthday)}{' '}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {showBirthDayPicker && (
                <View>
                  <DateTimePicker
                    value={birthday}
                    mode="date"
                    display="spinner"
                    textColor="white"
                    onChange={onBirthDayChange}
                  />
                  {Platform.OS === 'ios' && (
                    <Button
                      title="닫기"
                      onPress={() => setShowBirthDayPicker(false)}
                    />
                  )}
                </View>
              )}
            </View>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ overflow: 'hidden', borderRadius: 15, width: 175, marginTop:20 }}>
              <ImageBackground source={require('../assets/img/pinkBtn.png')}>
                <TouchableOpacity
                  onPress={async () => {
                    await AsyncStorage.setItem('MyName', name);
                    const SERVER_ADDRESS = await AsyncStorage.getItem(
                      'ServerAddress'
                    );
                    const ServerAccessToken = await AsyncStorage.getItem(
                      'ServerAccessToken'
                    );
                    await AsyncStorage.setItem('nickname', name);
                    await axios({
                      method: 'POST',
                      url: SERVER_ADDRESS + '/api/register/user',
                      headers: {
                        Authorization: 'Bearer: ' + ServerAccessToken,
                      },
                      data: {
                        nickname: name,
                        birthdate: formatYYYYMMDD(birthday),
                      },
                    })
                      .then((resp) => {
                        navigation.navigate('ChooseCharacter');
                      })
                      .catch(function (error) {
                        console.log('server error', error);
                      });
                  }}
                  style={{
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 5,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      marginHorizontal: 30,
                      marginVertical: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    제출하기
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <View style={{ overflow: 'hidden', borderRadius: 15, width: 175 }}>
              <ImageBackground source={require('../assets/img/grayBtn.png')}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  style={{
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 5,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      marginHorizontal: 30,
                      marginVertical: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    이전 페이지로
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    fontSize: 18,
    marginVertical: 5,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default FirstRegister;
