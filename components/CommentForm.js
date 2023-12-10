import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Modal,
  ActivityIndicator, Platform,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlienType from "./AlienType";
import {Ionicons} from "@expo/vector-icons";

export default function CommentForm({photoId, nickname}) {
  const [comment, setComment] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [uploadingComment, setUploadingComment] = useState(false);

  const calculateDaysAgo = (createAt) => {
    const createDate = new Date(createAt);
    const currentDate = new Date();

    if (isNaN(createDate.getTime())) {
      console.log("날짜 형식 잘못됨", createDate);
    }

    const timeDiff = currentDate - createDate;

    const secondsDiff = Math.floor(timeDiff / 1000);
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      if (hoursDiff === 0) {
        if (minutesDiff === 0) {
          return `${secondsDiff}초`;
        } else {
          return `${minutesDiff}분`;
        }
      } else {
        return `${hoursDiff}시간`;
      }
    } else {
      return `${daysDiff}일`;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const UserServerAccessToken = await AsyncStorage.getItem(
        "UserServerAccessToken"
      );
      try {
        const response = await fetch(
          `http://43.202.241.133:1998/photo/${photoId}/comments`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + UserServerAccessToken,
            },
          }
        );

        const data = await response.json();
        setComments(data.data);
        console.log(data.data);
      } catch (error) {
        console.error("댓글을 가져오는 중에 오류가 발생했습니다.", error);
      }
    };
    fetchData();
  }, []);

  const sendToComment = async () => {
    setUploadingComment(true); // 업로드 시작
    const UserServerAccessToken = await AsyncStorage.getItem(
      "UserServerAccessToken"
    );
    const writer = await AsyncStorage.getItem("nickname");
    const data = {
      photoId: photoId,
      content: comment,
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

        const newComment = {commentId: comments.length + 1, writer: writer, content: comment, createAt: Date.now()};
        setComments([...comments, newComment]);
        setComment(""); // 댓글 입력창 초기화
        const ktc = new Date();
        ktc.setHours(ktc.getHours() + 9);
        const str_today = JSON.stringify(ktc).toString().slice(1, 11);
        const test = JSON.parse(await AsyncStorage.getItem("todayMission"));
        const todayMissions = [
          "사진 찍어서 올리기",
          "내 갤러리 사진 등록하기",
          "사진에 댓글 달기",
          "가족들과 채팅으로 인사하기",
          "캘린더에 일정 등록하기",
        ];
        if (test) {
          if (test && typeof test === "object" && str_today in test) {
            if (test[str_today] === "사진에 댓글 달기") {
              await AsyncStorage.setItem("todayMissionClear", "true");
              await axios({
                method: "GET",
                url: "http://43.202.241.133:1998/mission",
                headers: {
                  Authorization: "Bearer " + UserServerAccessToken,
                },
              })
                .then((resp) => console.log(resp))
                .catch((e) => console.log(e));
            }
          } else {
            const randomIndex = Math.floor(
              Math.random() * todayMissions.length
            );
            await AsyncStorage.setItem(
              "todayMission",
              JSON.stringify({ [str_today]: todayMissions[randomIndex] })
            );
            if (test[str_today] === "사진에 댓글 달기") {
              await AsyncStorage.setItem("todayMissionClear", "true");
              await AsyncStorage.setItem("dailyMissionClear", "false");
              await axios({
                method: "GET",
                url: "http://43.202.241.133:1998/mission",
                headers: {
                  Authorization: "Bearer " + UserServerAccessToken,
                },
              })
                .then((resp) => console.log(resp))
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
            JSON.stringify({ [str_today]: todayMissions[randomIndex] })
          );
          if (test[str_today] === "사진에 댓글 달기") {
            await AsyncStorage.setItem("todayMissionClear", "true");
            await AsyncStorage.setItem("dailyMissionClear", "false");
            await axios({
              method: "GET",
              url: "http://43.202.241.133:1998/mission",
              headers: {
                Authorization: "Bearer " + UserServerAccessToken,
              },
            })
              .then((resp) => console.log(resp))
              .catch((e) => console.log(e));
          } else {
            await AsyncStorage.setItem("todayMissionClear", "false");
            await AsyncStorage.setItem("dailyMissionClear", "false");
          }
        }
      } else {
        console.error("❌ 서버 응답 오류:", response.status);
      }
    } catch (error) {
      console.error("❌ 댓글 안올라감 ㅜㅜㅜ", error);
    } finally {
      setUploadingComment(false); // 업로드 완료
    }
  };

  return (
    <View>
      {comments.length > 1 ? (
        <TouchableOpacity
          style={{paddingHorizontal: '7%', paddingTop: "3%",}}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{color: "gray", fontSize: 16,}}>
            댓글 {comments.length}개 모두 보기
          </Text>
        </TouchableOpacity>
      ) : (
        <View>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.commentId.toString()}
            renderItem={({item}) => (
              <View
                key={item.commentId}
                style={{
                  paddingHorizontal: '7%',
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 2,
                }}
              >
                <Text style={{fontWeight: "bold", paddingRight: 5,}}>{item.writer}</Text>
                <Text>{item.content}</Text>
                <Text style={{color: "gray",}}>{`   ${calculateDaysAgo(item.createAt)}`}</Text>
              </View>
            )}
          />
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: "10%",
        }}
      >
        <AlienType writer={nickname}/>
        <TextInput
          value={comment}
          style={styles.comment}
          onChangeText={setComment}
          placeholder="댓글..."
        />
        <TouchableOpacity onPress={sendToComment}>
          <Text style={{paddingLeft: 10}}>작성</Text>
        </TouchableOpacity>
        {uploadingComment && <ActivityIndicator style={{paddingLeft: 10, top: 10}} size="small" color="gray"/>}
      </View>

      <Modal
        presentationStyle="formSheet"
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          {Platform.OS === "ios" ? (
            <View style={{alignItems: "center"}}>
              <View style={styles.separator}/>
            </View>
          ) : (
            <View style={{alignItems: "flex-end", marginTop: 20,}}>
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}>
                <Ionicons name="close" size={24} color="black"/>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.modalContent}>
            <FlatList
              data={comments}
              keyExtractor={(item) => item.commentId.toString()}
              renderItem={({item}) => (
                <View
                  key={item.commentId}
                  style={styles.commentForm}
                >
                  <AlienType writer={item.writer}/>
                  <View>
                    <Text
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        fontSize: 14,
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>{item.writer}</Text>
                      <Text style={{ color: "gray" }}>{`  ${calculateDaysAgo(
                        item.createAt
                      )}`}</Text>
                    </Text>
                    <Text>{item.content}</Text>
                  </View>
                </View>
              )}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginHorizontal: 10,
              }}
            >
              <AlienType writer={nickname}/>
              <TextInput
                value={comment}
                style={styles.comment}
                onChangeText={setComment}
                placeholder="댓글 달기..."
              />
              <TouchableOpacity onPress={sendToComment}>
                <Text style={{paddingLeft: 10}}>작성</Text>
              </TouchableOpacity>
              {uploadingComment && <ActivityIndicator style={{paddingLeft: 10}} size="small" color="gray"/>}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 20,
    paddingHorizontal: 7,
  },
  separator: {
    height: 4,
    width: "12%",
    backgroundColor: "#CCC6C6",
    marginTop: "6%",
    marginVertical: 10,
    borderRadius: 50,
  },
  modalContent: {
    justifyContent: "center",
    marginVertical: 30,
    backgroundColor: "white",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  commentForm: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  comment: {
    fontSize: 15,
    marginTop: 20,
    width: "80%",
    borderColor: "#C1BABD",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 15,
    paddingVertical: 10,
    height: "45%",
  },
});
