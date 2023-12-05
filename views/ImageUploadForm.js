import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
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
export default function ImageUploadForm({ uri, onUploadComplete }) {
  const [photoTags, setPhotoTags] = useState([]);
  const [description, setDescription] = useState("");
  const toggleTag = (tag) => {
    // 선택된 태그 목록 업데이트
    if (photoTags.includes(tag)) {
      setPhotoTags(photoTags.filter((photoTags) => photoTags !== tag));
    } else {
      setPhotoTags([...photoTags, tag]);
    }
  };
  // 클라에서 바로 presigned url로 업로드
  // 1단계: signed url을 요청해서 받는다.
  // 2단계: 받아온 url에 put으로 요청해서 업로드한다.
  const uploadToServer = async () => {
    const familyId = await AsyncStorage.getItem("familyId");
    const UserServerAccessToken = await AsyncStorage.getItem(
      "UserServerAccessToken"
    );
    // 서버로 전송될 파일의 이름과 타입 지정
    const body = {
      prefix: familyId, // familyId
      fileName: uri.substring(uri.lastIndexOf("/") + 1),
    };
    try {
      // 1단계: 서버에 presigned url 요청
      const urlRes = await fetch("http://43.202.241.133:1998/photo/s3", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + UserServerAccessToken,
        },
      });
      const signedUrl = await urlRes.text();
      // console.log("👉🏻presigned url: ", signedUrl);
      const blob = await (await fetch(uri)).blob();
      // console.log("📝 blob: ", blob)
      // 2단계: 이미지를 해당 url에 put (upload)
      // 이미 파일 이름이나 경로 등은 url 받아올 때 지정해놨으므로 image 파일 객체와 content-type 정보만 넣어서 보냄
      // const access_token = await AsyncStorage.getItem("ServerAccessToken");
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: blob,
        headers: {
          "Content-type": "image/jpeg",
        },
      });
      // 서버 응답 확인
      // console.log("🚀 서버에 업로드 한 정보: ", uploadRes);
      // 서버 응답이 성공적인지 확인하고 필요한 처리 수행
      if (uploadRes.ok) {
        const writer = await AsyncStorage.getItem("nickname");
        const list = signedUrl.split("?");
        const imageInfo = {
          writer: writer,
          photoKey:
            familyId + "/" + list[0].substring(list[0].lastIndexOf("/") + 1),
          photoTags: photoTags,
          description: description,
        };
        const response = await fetch("http://43.202.241.133:1998/photo", {
          method: "POST",
          body: JSON.stringify(imageInfo),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + UserServerAccessToken,
          },
        });
        console.log("👌🏻 이미지 업로드 성공");
        Alert.alert("사진 올리기 성공!");
        onUploadComplete();
      } else {
        console.error("❌ 이미지 업로드 실패");
      }
    } catch (err) {
      console.log("서버 업로드 에러..", err);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          style={styles.uploadImage}
          source={{ uri: uri }}
          resizeMode="contain"
        />
        <View style={{ height: 20 }} />
        <View style={styles.tagButtonsContainer}>
          {TAG_OPTION.map((tagOption, index) => (
            <Pressable
              key={tagOption.id}
              style={[
                styles.tagButton,
                photoTags.includes(tagOption.id) && styles.tagButtonSelected,
                index !== TAG_OPTION.length - 1 && { marginRight: 10 },
              ]}
              onPress={() => toggleTag(tagOption.id)}
            >
              <Text
                style={{
                  ...styles.tagButtonText,
                  fontWeight: photoTags.includes(tagOption.id)
                    ? "bold"
                    : "normal",
                }}
              >
                {tagOption.item}
              </Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          style={[styles.input, styles.description]}
          value={description}
          onChangeText={setDescription}
          placeholder="문구를 입력하세요..."
          multiline
        />
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
          <TouchableOpacity
            style={[styles.button, styles.buttonWrite]}
            onPress={uploadToServer}
          >
            <Text style={{ ...styles.textStyle, color: "#fff" }}>공유</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={onUploadComplete}
          >
            <Text style={{ ...styles.textStyle, color: "#727272" }}>취소</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // padding: 20,
  },
  uploadImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.4,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "#C1BABD",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
    paddingVertical: 10,
  },
  description: {
    height: 100,
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
    marginBottom: 20,
  },
  tagButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0EBF2",
  },
  tagButtonSelected: {
    backgroundColor: "#E0EBF2",
  },
  tagButtonText: {
    color: "#000",
  },
});
