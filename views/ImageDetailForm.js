import React, {useState} from "react";
import {Alert, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Swiper from "react-native-web-swiper";
import ExpoFastImage from "expo-fast-image";
import CommentForm from "../components/CommentForm";
import AlienType from "../components/AlienType";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import {Ionicons} from "@expo/vector-icons";
import {MaterialIcons} from '@expo/vector-icons';


const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");

export default function ImageDetailForm({route, navigation}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [downStatus, setDownStatus] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const {photoInfo, albumList, nickname} = route.params;
  const index = albumList.findIndex(
    (item) => item.photoKey === photoInfo.photoKey
  );

  const downloadAndSaveImage = async (remoteUrl) => {
    try {
      const {uri} = await FileSystem.downloadAsync(
        remoteUrl,
        FileSystem.documentDirectory + `${photoInfo.photoId}.jpg`
      );
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.saveToLibraryAsync(asset);
      console.log("이미지 다운로드, 저장 성공!!!");
      Alert.alert("다운 성공~");
      // setDownStatus(true);

      // setTimeout(() => {
      //   setDownStatus(false);
      // }, 3000);   // 3초 후에 false로 변경
    } catch (error) {
      console.log("이미지 다운 에러!!!!", error);
    }
  };

  return (
    <View style={styles.container}>
      <Swiper controlsEnabled={false} from={index}>
        {albumList.map((item, index) => {
          const nowYear = new Date().getFullYear();
          const createDate = new Date(item.createAt);
          const year = createDate.getFullYear();
          const month = createDate.getMonth() + 1;
          const day = createDate.getDate().toString();
          const hours = createDate.getHours();
          const minutes = createDate.getMinutes();

          const formattedDate = `${month}월 ${day}일 ${hours}:${minutes}`;

          return (
            <View key={index}>
              <TouchableOpacity
                style={{
                  alignItems: "flex-start",
                  paddingHorizontal: "4%",
                  marginTop: "3%",
                }}
                onPress={() => navigation.pop()}
              >
                <Ionicons name="chevron-back" size={28} color="#603D9B"/>
              </TouchableOpacity>

              <View style={styles.slide}>
                <View
                  style={{
                    width: '100%',
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingHorizontal: '5%',
                    }}
                  >
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: "center",
                    }}>
                      <AlienType writer={item.writer}/>
                      <Text style={styles.writer}>{item.writer}</Text>
                    </View>
                    {item.writer === nickname ? (
                      <View style={{flexDirection: "row", alignItems: "center",}}>
                        <TouchableOpacity
                          onPress={() => downloadAndSaveImage(item.photoKey)}
                        >
                          {/*{downStatus &&*/}
                          {/*  <Alert w="100%" status="success" colorScheme="secondary" variant="outline-light">*/}
                          {/*    <Text fontSize="md" fontWeight="medium" color="coolGray.800">*/}
                          {/*      이미지 다운로드 성공!*/}
                          {/*    </Text>*/}
                          {/*  </Alert>*/}
                          {/*}*/}
                          <Ionicons
                            style={{
                              textAlign: 'right',
                              paddingRight: 5,
                            }}
                            name="ios-arrow-down-circle-outline"
                            size={26}
                            color="black"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleModal}>
                          <MaterialIcons
                            name="more-horiz"
                            size={25}
                            color="black"
                          />
                        </TouchableOpacity></View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => downloadAndSaveImage(item.photoKey)}
                      >
                        <Ionicons
                          name="ios-arrow-down-circle-outline"
                          size={26}
                          color="black"
                        />
                      </TouchableOpacity>
                    )}

                    <Modal
                      presentationStyle="formSheet"
                      animationType="slide"
                      visible={isModalVisible}
                      onRequestClose={toggleModal}
                    >
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <TouchableOpacity style={[styles.button, styles.buttonWrite]}>
                            <Text style={{...styles.textStyle, color: "#fff"}}>
                              수정
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.button, styles.buttonClose]}>
                            <Text style={{...styles.textStyle, color: "#555456"}}>
                              삭제
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={toggleModal}>
                            <Ionicons name="close" size={24} color="black"/>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                  </View>
                </View>

                <View style={{borderTopWidth: 1, borderTopColor: '#DEDDDD'}}>
                  <ExpoFastImage
                    uri={item.photoKey}
                    cacheKey={item.photoId.toString()}
                    style={styles.uploadImage}
                    resizeMode="contain"
                  />
                </View>

                {item.photoTags.length !== 0 && (
                  <View style={styles.tagButtonsContainer}>
                    {item.photoTags.map((tag, index) => (
                      <View key={tag}
                            style={[styles.tagButton, index !== item.photoTags.length - 1 && {marginRight: 10,}]}>
                        <Text
                          style={{fontWeight: "bold"}}>
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {item.description ? (
                  <View
                    style={{paddingHorizontal: "7%", flexDirection: "row", paddingTop: 5,}}>
                    <Text style={{...styles.writer, fontSize: 16,}}>{item.writer}</Text>
                    <Text style={styles.description}>
                      {item.description}
                    </Text>
                  </View>
                ) : null
                }

                <View style={{paddingHorizontal: "7%",}}>
                  <Text style={styles.date}>
                    {nowYear === year ? formattedDate : year + formattedDate}
                  </Text>
                </View>

                <CommentForm
                  photoId={item.photoId}
                  nickname={nickname}
                />
              </View>
            </View>
          );
        })}
      </Swiper>
    </View>
  )
    ;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  slide: {
    top: "3%",
    justifyContent: "center",
  },
  uploadImage: {
    marginVertical: 15,
    width: "100%",
    aspectRatio: 1,
  },
  description: {
    fontSize: 16,
    marginLeft: 5,
  },
  writer: {
    fontSize: 18,
    fontWeight: "bold",
  },
  date: {
    paddingTop: 3,
    width: "80%",
    fontSize: 14,
    color: "gray",
    marginBottom: 8,
  },
  button: {
    width: 65,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    opacity: 0.9,
  },
  buttonWrite: {
    backgroundColor: "#BF67BD",
    marginHorizontal: 10,
  },
  buttonClose: {
    backgroundColor: "#E2D4E1",
    marginHorizontal: 10,
  },
  textStyle: {
    textAlign: "center",
    fontFamily: "dnf",
  },
  tagButtonsContainer: {
    marginBottom: 5,
    flexDirection: "row",
    paddingHorizontal: "6%",
  },
  tagButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#E0EBF2",
    backgroundColor: "#E0EBF2",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 불투명한 검은 배경
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // 텍스트 색상을 흰색으로 설정
  },
  loading: {
    position: "absolute",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.9,
    resizeMode: "contain",
  },
  buttonDownload: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderColor: "#603D9B",
    borderWidth: 1,
  },
});