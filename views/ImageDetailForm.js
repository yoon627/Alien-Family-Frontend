import React, {useEffect, useState} from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Swiper from "react-native-web-swiper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Ionicons} from "@expo/vector-icons";

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");

export default function ImageDetailForm({route, navigation}) {
  const [comment, setComment] = useState("");
  const [familyInfo, setFamilyInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const {photoInfo, albumList} = route.params;
  const index = albumList.findIndex(
    (item) => item.photoKey === photoInfo.photoKey
  );

  const imageList = {
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
  };

  // 가족 정보
  useEffect(() => {
    const viewFamily = async () => {
      try {
        const resp = await AsyncStorage.getItem("myDB");
        setFamilyInfo(JSON.parse(resp));
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false); // 데이터 로딩이 완료되면 로딩 상태를 false로 설정
      }
    };

    viewFamily();
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>; // 로딩 중일 때 표시할 UI
  }

  function getAlienTypeByNickname(familyInfo, writer) {
    for (const key in familyInfo) {
      if (familyInfo[key].nickname === writer) {
        return familyInfo[key].alien.type;
      }
    }
    return null;
  }

  function findImageByName(writer) {
    const alienName = getAlienTypeByNickname(familyInfo, writer);
    if (alienName === null) {
      return imageList["BASIC"];
    }
    return imageList[alienName];
  }

  const sendToComment = async () => {
    const UserServerAccessToken = await AsyncStorage.getItem(
      "UserServerAccessToken"
    );
    const data = {
      photoId: photoInfo.photoId,
      comment: comment,
    };

    try {
      const response = await fetch("http://43.202.241.133:1998/comment", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + UserServerAccessToken,
        },
      });
      if (response.ok) {
        console.log("👂🏻 댓글 서버로 보내짐~~~~");
      } else {
        console.error("❌ 서버 응답 오류:", response.status);
      }
    } catch (error) {
      console.error("❌ 댓글 안올라감 ㅜㅜㅜ", error);
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

          const formattedDate = `${month}월 ${day}일 ${hours}시 ${minutes}분`;

          return (
            <View key={index} style={{top: "7%"}}>
              <TouchableOpacity
                style={{alignItems: "flex-start", paddingHorizontal: "3%"}}
                onPress={() => navigation.pop()}
              >
                <Ionicons name="chevron-back" size={28} color="#603D9B"/>
              </TouchableOpacity>

              <View style={styles.slide}>
                <View style={{alignItems: 'flex-start', width: '100%', marginBottom: 10,}}>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: '5%',
                    alignItems: 'center'
                  }}>
                    <Image
                      style={styles.profilePic}
                      source={findImageByName(item.writer)}
                    />
                    <Text style={styles.writer}>{item.writer}</Text>
                    <Text style={styles.date}>
                      {nowYear === year ? formattedDate : year + formattedDate}
                    </Text>
                  </View>
                </View>

                <View style={{borderTopWidth: 1, borderTopColor: '#DEDDDD'}}>
                  <Image
                    style={styles.uploadImage}
                    source={{uri: item.photoKey}}
                    resizeMode="contain"
                  />
                </View>

                {item.photoTags.length !== 0 && (
                  <View style={styles.tagButtonsContainer}>
                    {item.photoTags.map((tag, index) => (
                      <View key={tag} style={[styles.tagButton, index !== item.photoTags.length - 1 && {marginRight: 10,}]}>
                        <Text
                          style={{fontWeight: "bold"}}>
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <Text style={styles.description}>{item.description}</Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TextInput
                    value={comment}
                    style={styles.comment}
                    onChangeText={setComment}
                    placeholder="댓글..."
                  />
                  <TouchableOpacity onPress={sendToComment}>
                    <Text style={{paddingLeft: 10, top: 10}}>작성</Text>
                  </TouchableOpacity>
                </View>

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
            </View>
          );
        })}
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  tag: {
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    paddingHorizontal: "7%",
  },
  comment: {
    fontSize: 16,
    marginTop: 40,
    width: "80%",
    borderColor: "#C1BABD",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
    height: "45%",
  },
  writer: {
    fontSize: 18,
    fontWeight: "bold",
  },
  date: {
    paddingHorizontal: "5%",
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
  profilePic: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
    borderRadius: SCREEN_WIDTH * 0.1 / 2,
    resizeMode: "contain",
    backgroundColor: "#FFEEC3",
    marginRight: 10,
  },
});
