import React, {useEffect, useState} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlienType from "./AlienType";

export default function CommentForm({photoId}) {
  const [comment, setComment] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [uploadingComment, setUploadingComment] = useState(false);

  const calculateDaysAgo = (createAt) => {
    const createDate = new Date(createAt);
    const currentDate = new Date();

    const timeDiff = currentDate - createDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
      if (hoursDiff === 0) {
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        return `${minutesDiff}분`;
      } else {
        return `${hoursDiff}시간`;
      }
    } else {
      return `${daysDiff}일`;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const UserServerAccessToken = await AsyncStorage.getItem(
        "UserServerAccessToken"
      );
      try {
        const response = await fetch(`http://43.202.241.133:1998/photo/${photoId}/comments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + UserServerAccessToken,
          },
        });

        const data = await response.json();
        setComments(data.data);
        // console.log(data.data);
      } catch (error) {
        console.error("댓글을 가져오는 중에 오류가 발생했습니다.", error);
      }
    }
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

        const newComment = {commentId: comments.length + 1, writer: writer, content: comment};
        setComments([...comments, newComment]);
        setComment(""); // 댓글 입력창 초기화
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
      {comments.length !== 0 ? (
        <TouchableOpacity
          style={{paddingHorizontal: '5%', paddingVertical: "3%",}}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{color: "gray",}}>
            댓글 {comments.length}개 모두 보기
          </Text>
        </TouchableOpacity>) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: "10%",
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
          {uploadingComment && <ActivityIndicator style={{paddingLeft: 10, top: 10}} size="small" color="gray"/>}
        </View>
      )
      }

      <Modal
        presentationStyle="formSheet"
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={{alignItems: "center"}}>
            <View style={styles.separator}/>
          </View>

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
                    <Text style={{flexDirection: "row", alignItems: "center", fontSize: 14,}}>
                      <Text style={{fontWeight: "bold",}}>{item.writer}</Text>
                      <Text style={{color: "gray",}}>{`  ${calculateDaysAgo(item.createAt)}`}</Text>
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
                marginHorizontal: 15,
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
              {uploadingComment && <ActivityIndicator style={{paddingLeft: 10, top: 10}} size="small" color="gray"/>}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
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
    paddingVertical: 1,
  },
  comment: {
    fontSize: 16,
    marginTop: 40,
    width: "100%",
    borderColor: "#C1BABD",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 15,
    height: "45%",
  },
});