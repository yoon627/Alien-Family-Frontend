import React, {useEffect, useState} from "react";
import {
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
import LottieView from "lottie-react-native";
import axios from "axios";

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");

export default function ImageUploadForm({uri, onUploadComplete}) {
  const [photoTags, setPhotoTags] = useState([]);
  const [description, setDescription] = useState("");
  const [tagList, setTagList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 가족 태그
  useEffect(() => {
    const fetchTagList = async () => {
      const UserServerAccessToken = await AsyncStorage.getItem(
        "UserServerAccessToken"
      );
      try {
        const response = await fetch(
          `http://43.202.241.133:1998/api/family/koreanVer`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + UserServerAccessToken,
            },
          }
        );

        const data = await response.json();
        setTagList(data.data);
      } catch (error) {
        console.error("가족 태그를 불러오지 못했습니다.", error);
      }
    };
    fetchTagList();
  }, []);

  const toggleTag = (tag) => {
    setPhotoTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((photoTag) => photoTag !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
    // console.log("선택한 태그!!!!", photoTags);
  };

  // 클라에서 바로 presigned url로 업로드
  // 1단계: signed url을 요청해서 받는다.
  // 2단계: 받아온 url에 put으로 요청해서 업로드한다.
  const uploadToServer = async () => {
    setIsLoading(true);
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
        // console.log("이미지 인포!!!!!!!!!!", imageInfo);

        const response = await fetch("http://43.202.241.133:1998/photo", {
          method: "POST",
          body: JSON.stringify(imageInfo),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + UserServerAccessToken,
          },
        });
        // console.log("👌🏻 이미지 업로드 성공");
        const ktc = new Date();
        ktc.setHours(ktc.getHours() + 9);
        const str_today = JSON.stringify(ktc).toString().slice(1, 11);
        const test = JSON.parse(await AsyncStorage.getItem("todayMission"));
        const todayMissions = [
          // "사진 찍어서 올리기",
          // "내 갤러리 사진 등록하기",
          "사진에 댓글 달기",
          // "가족들과 채팅으로 인사하기",
          // "캘린더에 일정 등록하기",
        ];
        if (test) {
          if (test && typeof test === "object" && str_today in test) {
            if (
              test[str_today] === "사진 찍어서 올리기" ||
              test[str_today] === "내 갤러리 사진 등록하기"
            ) {
              await AsyncStorage.setItem("todayMissionClear", "true");
              await axios({
                method: "GET",
                url: "http://43.202.241.133:1998/mission",
                headers: {
                  Authorization: "Bearer " + UserServerAccessToken,
                },
              })
                .catch((e) => console.log(e));
            }
          } else {
            const randomIndex = Math.floor(
              Math.random() * todayMissions.length
            );
            await AsyncStorage.setItem(
              "todayMission",
              JSON.stringify({[str_today]: todayMissions[randomIndex]})
            );
            if (
              test[str_today] === "사진 찍어서 올리기" ||
              test[str_today] === "내 갤러리 사진 등록하기"
            ) {
              await AsyncStorage.setItem("todayMissionClear", "true");
              await AsyncStorage.setItem("dailyMissionClear", "false");
              await axios({
                method: "GET",
                url: "http://43.202.241.133:1998/mission",
                headers: {
                  Authorization: "Bearer " + UserServerAccessToken,
                },
              })
                .catch((e) => console.log(e));
            } else {
              await AsyncStorage.setItem("todayMissionClear", "false");
              await AsyncStorage.setItem("dailyMissionClear", "false");
            }
          }
        } else {
          const randomIndex = Math.floor(Math.random() * todayMissions.length);
          await AsyncStorage.setItem(
            "todayMission",
            JSON.stringify({[str_today]: todayMissions[randomIndex]})
          );
          if (
            test[str_today] === "사진 찍어서 올리기" ||
            test[str_today] === "내 갤러리 사진 등록하기"
          ) {
            await AsyncStorage.setItem("todayMissionClear", "true");
            await AsyncStorage.setItem("dailyMissionClear", "false");
            await axios({
              method: "GET",
              url: "http://43.202.241.133:1998/mission",
              headers: {
                Authorization: "Bearer " + UserServerAccessToken,
              },
            })
              .catch((e) => console.log(e));
          } else {
            await AsyncStorage.setItem("todayMissionClear", "false");
            await AsyncStorage.setItem("dailyMissionClear", "false");
          }
        }
        onUploadComplete();
      } else {
        console.error("❌ 이미지 업로드 실패");
      }
    } catch (err) {
      console.log("서버 업로드 에러..", err);
    } finally {
      setIsLoading(false); // 업로드 완료 시 로딩 상태 false로 설정
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
          source={{uri: uri}}
          resizeMode="contain"
        />
        <View style={{height: 20}}/>
        <View style={styles.tagButtonsContainer}>
          {tagList.map((tag, index) => (
            <Pressable
              key={tag}
              style={[
                styles.tagButton,
                photoTags.includes(tag) && styles.tagButtonSelected,
                index !== tagList.length - 1 && {marginRight: 10},
              ]}
              onPress={() => toggleTag(tag)}
            >
              <Text
                style={{
                  ...styles.tagButtonText,
                  fontWeight: photoTags.includes(tag) ? "bold" : "normal",
                }}
              >
                {tag}
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
        <View style={{marginTop: 60}}/>
        <View style={{flexDirection: "row", marginVertical: 10}}>
          <TouchableOpacity
            style={[styles.button, styles.buttonWrite]}
            onPress={uploadToServer}
          >
            <Text style={{...styles.textStyle, color: "#fff"}}>공유</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={onUploadComplete}
          >
            <Text style={{...styles.textStyle, color: "#555456"}}>취소</Text>
          </TouchableOpacity>
        </View>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <LottieView
              style={styles.loading}
              source={require("../assets/json/upload.json")}
              autoPlay
              loop
            />
            <Text style={styles.loadingText}>Uploading...</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.45,
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
    backgroundColor: "#B2B6DB",
    marginHorizontal: 10,
  },
  buttonClose: {
    backgroundColor: "#F0F2FF",
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
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E0EBF2",
  },
  tagButtonSelected: {
    backgroundColor: "#E0EBF2",
  },
  tagButtonText: {
    color: "#000",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 불투명한 검은 배경
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff", // 텍스트 색상을 흰색으로 설정
  },
  loading: {
    position: "absolute",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.9,
    resizeMode: "contain",
  },
});
