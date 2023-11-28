import {useState} from "react";
import {Button, View, Image, TextInput, StyleSheet} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import SelectBox from 'react-native-multi-selectbox'
import {xorBy} from "lodash";

const K_OPTIONS = [
  {
    item: '아빠',
    id: 'DAD',
  },
  {
    item: '엄마',
    id: 'MOM',
  },
  {
    item: '첫째',
    id: 'FIR',
  },
  {
    item: '둘째',
    id: 'SEC',
  },
]
export default function ImageUploadForm({uri, onUploadComplete}) {
  const [photoTags, setPhotoTags] = useState(['DAD'])
  const [description, setDescription] = useState('');

  // 클라에서 바로 presigned url로 업로드
  // 1단계: signed url을 요청해서 받는다.
  // 2단계: 받아온 url에 put으로 요청해서 업로드한다.
  const uploadToServer = async () => {
    const familyId = await AsyncStorage.getItem("familyId");
    // 서버로 전송될 파일의 이름과 타입 지정
    const body = {
      prefix: 901,   // familyId
      fileName: uri.substring(uri.lastIndexOf('/') + 1),
    };

    try {
      // 1단계: 서버에 presigned url 요청
      const urlRes = await fetch('http://43.202.241.133:8080/photo/s3', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0NTEiLCJhdXRoIjoiUk9MRV9VU0VSIiwiZmFtaWx5IjoiNTM1IiwiZXhwIjoxNzAxMjA1NTc5fQ.-TPkx6HuGSZy9-wSpsJrLFGrUuxYK8NYImOMl5RP2fk`,
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
        method: 'PUT',
        body: blob,
        headers: {
          'Content-type': "image/jpeg",
        },
      });

      // 서버 응답 확인
      // console.log("🚀 서버에 업로드 한 정보: ", uploadRes);

      // 서버 응답이 성공적인지 확인하고 필요한 처리 수행
      if (uploadRes.ok) {
        const list = signedUrl.split('?')
        const imageInfo = {
          photoKey: 901 + '/' + list[0].substring(list[0].lastIndexOf('/') + 1),
          photoTags: photoTags,
          description: "아빠 사진 잘나왔다!",
        };
        console.log(imageInfo);

        const response = await fetch('http://43.202.241.133:8080/photo', {
          method: 'POST',
          body: JSON.stringify(imageInfo),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0NTEiLCJhdXRoIjoiUk9MRV9VU0VSIiwiZmFtaWx5IjoiNTM1IiwiZXhwIjoxNzAxMjA1NTc5fQ.-TPkx6HuGSZy9-wSpsJrLFGrUuxYK8NYImOMl5RP2fk`,
          },
        });
        console.log("👌🏻 이미지 업로드 성공");
        onUploadComplete();
      } else {
        console.error("❌ 이미지 업로드 실패");
      }
    } catch (err) {
      console.log("서버 업로드 에러..", err);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.uploadImage}
        source={{uri: uri}}
        width={100}
        height={100}
        resizeMode="contain"
      />
      <View style={{height: 40}}/>
      {/*<SelectBox*/}
      {/*  label="사진 속 인물을 선택해주십샤"*/}
      {/*  options={K_OPTIONS}*/}
      {/*  selectedValues={selectedTeams}*/}
      {/*  onMultiSelect={onMultiChange}*/}
      {/*  onTapClose={onMultiChange}*/}
      {/*  isMulti*/}
      {/*/>*/}
      <TextInput
        style={styles.input}
        value={photoTags.join(', ')} // 배열을 문자열로 변환
        onChangeText={(text) => setPhotoTags(text.split(',').map(tag => tag.trim()))} // 문자열을 배열로 변환
        placeholder="photoTags"
        multiline
      />
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        multiline
      />
      <Button
        title="Upload"
        onPress={uploadToServer}
        color="#841584" // 버튼 색상 지정 (예시)
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  picker: {
    height: 40,
    width: 200,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10, // 좌우 패딩
    borderRadius: 5,
  },
  description: {
    height: 80,
  },
});