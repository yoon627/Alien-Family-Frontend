import React, {useState} from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Swiper from "react-native-web-swiper";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const {photoInfo, albumList} = route.params;
  const index = albumList.findIndex(
    (item) => item.photoKey === photoInfo.photoKey,
  );
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
      <Swiper controlsEnabled={true} from={index}>
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
            <View key={index} style={styles.slide}>
              <View style={{alignItems: "flex-start", width: "90%"}}>
                <Text style={styles.writer}>{item.writer}</Text>
                <Image
                  style={styles.uploadImage}
                  source={{uri: item.photoKey}}
                  resizeMode="contain"
                />
                <Text style={styles.date}>
                  {nowYear === year ? formattedDate : year + formattedDate}
                </Text>
              </View>

              <View style={styles.tagButtonsContainer}>
                <View style={styles.tagButton}>
                  {item.photoTags.map((tag, index) => (
                    <Text key={index} style={{fontWeight: "bold"}}>
                      {tag}
                    </Text>
                  ))}
                </View>
              </View>

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
                <Pressable onPress={sendToComment}>
                  <Text style={{paddingLeft: 10, top: 10}}>작성</Text>
                </Pressable>
              </View>

              <View style={{flexDirection: "row", marginVertical: 10}}>
                <Pressable style={[styles.button, styles.buttonWrite]}>
                  <Text style={{...styles.textStyle, color: "#fff"}}>
                    수정
                  </Text>
                </Pressable>
                <Pressable style={[styles.button, styles.buttonClose]}>
                  <Text style={{...styles.textStyle, color: "#727272"}}>
                    삭제
                  </Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate("Home")}>
                  <Text>앨범으로</Text>
                </Pressable>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // padding: 10,
  },
  uploadImage: {
    width: "100%",
    aspectRatio: 1,
    marginBottom: 20,
  },
  tag: {
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    fontSize: 20,
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
    marginBottom: 10,
  },
  date: {
    fontSize: 18,
    color: "gray",
    marginBottom: 20,
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
  },
  tagButton: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#E0EBF2",
    backgroundColor: "#E0EBF2",
  },
});