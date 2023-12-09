import React from "react";
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Swiper from "react-native-web-swiper";
import {Ionicons} from "@expo/vector-icons";
import ExpoFastImage from "expo-fast-image";
import CommentForm from "../components/CommentForm";
import AlienType from "../components/AlienType";

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");

export default function ImageDetailForm({route, navigation}) {
  const {photoInfo, albumList} = route.params;
  const index = albumList.findIndex(
    (item) => item.photoKey === photoInfo.photoKey
  );

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

          const formattedDate = `${month}월 ${day}일 ${hours}시 ${minutes}분`;

          return (
            <View key={index} style={{top: "2%"}}>
              {/*<KeyboardAvoidingView*/}
              {/*  behavior={Platform.OS === "ios" ? "height" : undefined}*/}
              {/*  style={styles.container}*/}
              {/*>*/}
              <TouchableOpacity
                style={{
                  alignItems: "flex-start",
                  paddingHorizontal: "4%",
                  marginBottom: 10,
                }}
                onPress={() => navigation.pop()}
              >
                <Ionicons name="chevron-back" size={28} color="#603D9B"/>
              </TouchableOpacity>

              <View style={styles.slide}>
                <View
                  style={{
                    alignItems: 'flex-start',
                    width: '100%',
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: '5%',
                      alignItems: 'center'
                    }}
                  >
                    <AlienType writer={item.writer}/>
                    <Text style={styles.writer}>{item.writer}</Text>
                    <Text style={styles.date}>
                      {nowYear === year ? formattedDate : year + formattedDate}
                    </Text>
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
                  <View style={{paddingHorizontal: "5%", flexDirection: "row", alignItems: "center", paddingTop: "5%",}}>
                    <Text style={{...styles.writer, fontSize: 16,}}>{item.writer}</Text>
                    <Text style={styles.description}>
                      {item.description}
                    </Text>
                  </View>
                ) : null
                }

                <CommentForm
                  photoId={item.photoId}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 10,
                  }}
                >
                  <TouchableOpacity style={[styles.button, styles.buttonWrite]}>
                    <Text style={{...styles.textStyle, color: "#fff"}}>
                      수정
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.buttonClose]}>
                    <Text style={{...styles.textStyle, color: "#727272"}}>
                      삭제
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/*</KeyboardAvoidingView>*/}
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
    paddingRight: "10%",
    justifyContent: "flex-end",
    width: "80%",
    fontSize: 14,
    color: "gray",
    textAlign: 'right',
  },
  button: {
    width: 65,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    opacity: 0.9,
  },
  buttonWrite: {
    backgroundColor: "#603D9B",
    marginHorizontal: 10,
  },
  buttonClose: {
    backgroundColor: "#DED1DF",
    marginHorizontal: 10,
  },
  textStyle: {
    textAlign: "center",
    fontFamily: "dnf",
  },
  tagButtonsContainer: {
    marginBottom: 10,
    flexDirection: "row",
    paddingHorizontal: "5%",
  },
  tagButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 13,
    paddingVertical: 10,
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
});