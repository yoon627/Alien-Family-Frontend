import React, {useEffect, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View, StyleSheet, FlatList} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CommentForm({photoId}) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    loadComments();
  }, [photoId]);

  const saveComments = async (commentsToSave) => {
    try {
      await AsyncStorage.setItem(`comments_${photoId}`, JSON.stringify(commentsToSave));
    } catch (e) {
      console.error('댓글 저장 에러...', e);
    }
  };

  const loadComments = async () => {
    try {
      const storedComments = await AsyncStorage.getItem(`comments_${photoId}`);
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      }
    } catch (e) {
      console.error('댓글 로딩 에러,,,', e);
    }
  };

  const sendToComment = async () => {
    const UserServerAccessToken = await AsyncStorage.getItem(
      "UserServerAccessToken"
    );
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

        // 댓글 작성 후 화면 업데이트
        const newComments = [...comments, {id: comments.length + 1, content: comment}];
        setComments(newComments);
        saveComments(newComments);
        setComment(""); // 댓글 입력창 초기화
      } else {
        console.error("❌ 서버 응답 오류:", response.status);
      }
    } catch (error) {
      console.error("❌ 댓글 안올라감 ㅜㅜㅜ", error);
    }
  };

  return (
    <View>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <View key={item.id}>
            <Text>{item.content}</Text>
          </View>
        )}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text></Text>
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
    </View>
  )
}

const styles = StyleSheet.create({
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
})