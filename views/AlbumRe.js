import UploadModeModal from "../components/UploadModeModal";
import * as ImagePicker from "expo-image-picker";
import CameraPermissions from "../components/CameraPermissions";
import ImagePickerPermissions from "../components/ImagePickerPermissions";
import ImageFetcher from "../components/ImageFetcher";
import ModalControls from "../components/ModalControls";
import ImageUploader from "../components/ImageUploader";
import {View, Text, StyleSheet, Pressable, Platform, ActionSheetIOS, FlatList, Image} from "react-native";
import React, {useState} from "react";
import {ImagePlus} from "lucide-react-native";

export default function AlbumRe({navigation}) {
  const {cameraStatus, cameraRequestPermission} = CameraPermissions();
  const {albumStatus, albumRequestPermission} = ImagePickerPermissions();
  const imageData = ImageFetcher();
  const {modalOpen} = ModalControls({onLaunchCamera, onLaunchImageLibrary});
  const [imageUrl, setImageUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const imagePickerOption = {
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: false,
    quality: 1,
    aspect: [1, 1],
    includeBase64: Platform.OS === 'android',
  };

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
          ImageUploader(chosenImage, uri); // 이미지 선택 후 서버로 업로드
        } else {
          console.log("No assets found!");
        }
      }
    } catch (error) {
      console.error("Error!!!!! : ", error);
    }
  };

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
          ImageUploader(chosenImage, uri); // 이미지 선택 후 서버로 업로드
        } else {
          console.log("No assets found!");
        }

      }
    } catch (error) {
      console.error("Error!!!!! : ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Album</Text>
      <FlatList
        data={imageData}
        keyExtractor={(item) => item.photoId.toString()}
        renderItem={({item}) => (
          <View>
            <Image
              source={{uri: item.photoUrl}}
              style={styles.image}
              resizeMode="cover"
            />
            <Text>{item.photoTags.join(', ')}</Text>
          </View>
        )}
      />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    margin: 8,
  },
});