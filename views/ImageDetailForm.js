import React from "react";
import {Image, Text, View, StyleSheet} from "react-native";

export default function ImageDetailForm({route}) {
  const {photoInfo} = route.params;
  const createDate = new Date(photoInfo.createAt);

  const year = createDate.getFullYear();
  const month = createDate.getMonth() + 1;
  const day = createDate.getDate();
  const hours = createDate.getHours();
  const minutes = createDate.getMinutes();

  const formattedDate = `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{formattedDate}</Text>
      <Text style={styles.date}>사진 주인: {photoInfo.writer}</Text>
      <Image style={styles.uploadImage} source={{uri: photoInfo.photoKey}} resizeMode="contain"/>
      <Text style={styles.tag}>태그: {photoInfo.photoTags.join(', ')}</Text>
      <Text style={styles.description}>설명: {photoInfo.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  date: {
    fontSize: 18,
    marginBottom: 10,
  },
  uploadImage: {
    width: "80%",
    aspectRatio: 1,
    marginBottom: 20,
  },
  tag: {
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
  },
});
