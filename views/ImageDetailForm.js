import React, {useEffect, useState} from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput, TouchableOpacity,
  View,
} from "react-native";
import Swiper from "react-native-web-swiper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Ionicons} from '@expo/vector-icons';
import view from "react-native-reanimated/src/reanimated2/component/View";

const TAG_OPTION = [
  {
    item: "아빠",
    id: "DAD",
  },
  {
    item: "엄마",
    id: "MOM",
  },
  {
    item: "첫째",
    id: "FIRST",
  },
  {
    item: "둘째",
    id: "SECOND",
  },
  {
    item: "기타",
    id: "EXTRA",
  },
];

export default function ImageDetailForm({route, navigation}) {
  const [comment, setComment] = useState("");
  const [familyInfo, setFamilyInfo] = useState([]);

  const {photoInfo, albumList} = route.params;
  const index = albumList.findIndex(
    (item) => item.photoKey === photoInfo.photoKey,
  );

  const imageList = [
    {name: "BASIC", image: require("../assets/img/character/BASIC.png")},
    {name: "GLASSES", image: require("../assets/img/character/GLASSES.png")},
    {name: "GIRL", image: require("../assets/img/character/GIRL.png")},
    {name: "BAND_AID", image: require("../assets/img/character/BAND_AID.png")},
    {name: "RABBIT", image: require("../assets/img/character/RABBIT.png")},
    {name: "HEADBAND", image: require("../assets/img/character/HEADBAND.png")},
    {name: "TOMATO", image: require("../assets/img/character/TOMATO.png")},
    {
      name: "CHRISTMAS_TREE",
      image: require("../assets/img/character/CHRISTMAS_TREE.png"),
    },
    {name: "SANTA", image: require("../assets/img/character/SANTA.png")},
    {name: "PIRATE", image: require("../assets/img/character/PIRATE.png")},
  ];

  // 가족 정보
  useEffect(() => {
    const viewFamily = async () => {
      try {
        const resp = await AsyncStorage.getItem("myDB");
        setFamilyInfo(JSON.parse(resp));
        console.log("👨‍👩‍👧‍👦나의 가족 정보", resp);
      } catch (e) {
        console.log(e);
      }
    };
    viewFamily();
  }, []);

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
    console.log(alienName);
    if (alienName === null) {
      return imageList[0].image;
    }
    console.log(imageList.find((item) => item.name === 'SANTA').image);
    return imageList.find((item) => item.name === alienName).image;
  }


  const sendToComment = async () => {
    const UserServerAccessToken = await AsyncStorage.getItem(
      "UserServerAccessToken",
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
                onPress={() => navigation.pop()}>
                <Ionicons name="chevron-back" size={28} color="#C336CF"/>
              </TouchableOpacity>

              <View style={styles.slide}>
                <View style={{alignItems: "flex-start", width: "100%"}}>

                  <View style={{flexDirection: "row", marginBottom: 5, paddingHorizontal: "5%",}}>
                    <Image
                      source={findImageByName(item.writer)}
                      style={styles.profilePic}
                    />
                    <Text style={styles.writer}>{item.writer}</Text>
                  </View>

                  <Image
                    style={styles.uploadImage}
                    source={{uri: item.photoKey}}
                    resizeMode="contain"
                  />
                  <Text style={styles.date}>
                    {nowYear === year ? formattedDate : year + formattedDate}
                  </Text>
                </View>

                {item.photoTags.length !== 0 &&
                  <View style={styles.tagButtonsContainer}>
                    <View style={styles.tagButton}>
                      {item.photoTags.map((tag, index) => (
                        <Text key={tag} style={{fontWeight: "bold"}}>
                          {tag}
                        </Text>
                      ))}
                    </View>
                  </View>}

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

                <View style={{flexDirection: "row", justifyContent: "center", marginVertical: 10}}>
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
          )
            ;
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
    width: "100%",
    aspectRatio: 1,
    marginBottom: 10,
  },
  tag: {
    fontSize: 16,
  },
  description: {
    fontSize: 20,
    paddingHorizontal: "5%",
  },
  comment: {
    fontSize: 15,
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
    fontSize: 20,
    fontWeight: "bold",
  },
  date: {
    fontSize: 18,
    color: "gray",
    marginBottom: 5,
    paddingHorizontal: "5%",
  },
  button: {
    width: 65,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    opacity: 0.9,
  },
  buttonWrite: {
    backgroundColor: "#C336CF",
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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "5%",
  },
  tagButton: {
    marginTop: 10,
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
    width: 30, // 이미지 크기 조절
    height: 30, // 이미지 크기 조절
    resizeMode: "contain",
    borderRadius: 20, // 원형으로 만들기
  },
});