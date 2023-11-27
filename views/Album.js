import React, {useState} from "react";
import {View, Text, StyleSheet, Pressable, Platform, ActionSheetIOS} from "react-native";
import {ImagePlus} from "lucide-react-native";
import UploadModeModal from "../components/UploadModeModal";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Album({navigation}) {
  // 카메라 권한 요청을 위한 훅
  const [cameraStatus, cameraRequestPermission] = ImagePicker.useCameraPermissions();
  // 앨범 권한 요청을 위한 훅
  const [albumStatus, albumRequestPermission] = ImagePicker.useMediaLibraryPermissions();
  // 화면 표시를 위한 임시 url (선택한 이미지 주소)
  const [imageUrl, setImageUrl] = useState('');
  // 안드로이드를 위한 모달 visible 상태값
  const [modalVisible, setModalVisible] = useState(false);
  const [imageList, setImageList] = useState([]);

  const imagePickerOption = {
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: false,
    quality: 1,
    aspect: [1, 1],
    includeBase64: Platform.OS === "android",
  };

  // 선택 모달 오픈
  const modalOpen = () => {
    if (Platform.OS === "android") {
      setModalVisible(true);
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["사진 찍기", "카메라롤에서 선택하기", "취소"],
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            onLaunchCamera();
          } else if (buttonIndex === 1) {
            onLaunchImageLibrary();
          }
        }
      )
    }
  }

  // 카메라 촬영
  const onLaunchCamera = async () => {
    try {
      // 권한 확인 (권한 없으면 물어보고, 승인하지 않으면 함수 종료)
      if (!cameraStatus?.granted) {
        const cameraPermission = await cameraRequestPermission();
        if (!cameraPermission.granted) {
          return null;
        }
      } else {
        // 이미지 결과 (화면용, 실제로 s3에 업로드 한 이미지 아님)
        const result = await ImagePicker.launchCameraAsync(imagePickerOption);
        // 이미지 업로드 취소한 경우
        if (result.canceled) {
          return null;
        }
        // 이미지 업로드 결과 및 이미지 경로 업데이트
        if (result.assets && result.assets.length > 0) {
          const chosenImage = result.assets[0];
          const uri = chosenImage.uri;
          setImageUrl(uri);
          console.log("🐰 저장한 이미지!!!!!!", chosenImage);
          uploadToServer(chosenImage, uri); // 이미지 선택 후 서버로 업로드
        } else {
          console.log("No assets found!");
        }
      }
    } catch (error) {
      console.error("Error!!!!! : ", error);
    }
  }

  // 갤러리에서 사진 선택
  const onLaunchImageLibrary = async () => {
    try {
      // 권한 확인 (권한 없으면 물어보고, 승인하지 않으면 함수 종료)
      if (!albumStatus?.granted) {
        const albumPermission = await albumRequestPermission();
        if (!albumPermission.granted) {
          return null;
        }
      } else {
        // 이미지 선택 (화면용, 실제로 s3에 업로드 한 이미지 아님)
        const result = await ImagePicker.launchImageLibraryAsync(imagePickerOption);
        // 이미지 업로드 취소한 경우
        if (result.canceled) {
          return null;
        }
        // 이미지 업로드 결과 및 이미지 경로 업데이트
        if (result.assets && result.assets.length > 0) {
          const chosenImage = result.assets[0];
          const uri = chosenImage.uri;
          setImageUrl(uri);
          console.log("🐰 저장한 이미지!!!!!!", chosenImage);
          uploadToServer(chosenImage, uri); // 이미지 선택 후 서버로 업로드
        } else {
          console.log("No assets found!");
        }

      }
    } catch (error) {
      console.error("Error!!!!! : ", error);
    }
  }

  // 클라에서 바로 presigned url로 업로드
  // 1단계: signed url을 요청해서 받는다.
  // 2단계: 받아온 url에 put으로 요청해서 업로드한다.
  const uploadToServer = async (chosenImage, uri) => {
    // 서버로 전송될 파일의 이름과 타입 지정
    const body = {
      fileName: uri.substring(uri.lastIndexOf('/') + 1),
      prefix: "photoAlbum",
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

      const blob = await (await fetch(signedUrl)).blob();
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
      console.log("🚀 서버에 업로드 한 정보: ", uploadRes);

      // 서버 응답이 성공적인지 확인하고 필요한 처리 수행
      if (uploadRes.ok) {
        console.log("👌🏻 이미지 업로드 성공");
      } else {
        console.error("❌ 이미지 업로드 실패");
      }
    } catch (err) {
      console.log("서버 업로드 에러..", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Album</Text>
      <Pressable onPress={modalOpen}>
        <ImagePlus
          color="navy"
          size={40}
        />
      </Pressable>
      <UploadModeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLaunchCamera={onLaunchCamera}
        onLaunchImageLibrary={onLaunchImageLibrary}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
