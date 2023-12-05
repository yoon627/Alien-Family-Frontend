import React, {
  Fragment,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  ActionSheetIOS,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import UploadModeModal from "../components/UploadModeModal";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageUploadForm from "./ImageUploadForm";
import ExpoFastImage from "expo-fast-image";
import * as Notifications from "expo-notifications";
import { useFocusEffect } from "@react-navigation/native";
const SCREEN_WIDTH = Dimensions.get("window").width;

const TAG_OPTION = [
  {
    item: "# 아빠",
    id: "DAD",
  },
  {
    item: "# 엄마",
    id: "MOM",
  },
  {
    item: "# 첫째",
    id: "FIRST",
  },
  {
    item: "# 둘째",
    id: "SECOND",
  },
  {
    item: "# 기타",
    id: "EXTRA",
  },
];
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
export default function AlbumScreen({ navigation }) {
  // 카메라 권한 요청을 위한 훅
  const [cameraStatus, cameraRequestPermission] =
    ImagePicker.useCameraPermissions();
  // 앨범 권한 요청을 위한 훅
  const [albumStatus, albumRequestPermission] =
    ImagePicker.useMediaLibraryPermissions();
  // 선택한 이미지 객체 저장
  const [chosenImage, setChosenImage] = useState("");
  // 안드로이드를 위한 모달 visible 상태값
  const [modalVisible, setModalVisible] = useState(false);
  // 앨범에 보여줄 이미지 목록 (s3에서 불러온 이미지들)
  const [albumList, setAlbumList] = useState([]);
  // 이미지 올리는 form
  const [showUploadForm, setShowUploadForm] = useState(false);
  // 선택한 태그
  const [selectedTags, setSelectedTags] = useState([]);
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const handleUploadComplete = () => {
    setShowUploadForm(false);
  };
  useEffect(() => {
    // 서버에서 s3 이미지 url 받아옴
    const fetchData = async () => {
      const UserServerAccessToken = await AsyncStorage.getItem(
        "UserServerAccessToken"
      );
      try {
        const response = await fetch(`http://43.202.241.133:1998/photo`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + UserServerAccessToken,
          },
        });
        const data = await response.json();
        // 받아온 이미지 데이터 상태에 저장
        setAlbumList(data.data);
        // console.log("받은 데이터!!!!!!!!!", data.data);
        // console.log("👉🏻앨범 이미지 리스트: ", data.data.map(item => item.photoKey));
      } catch (error) {
        console.error("이미지 url을 가져오는 중에 오류가 발생했습니다.", error);
      }
    };
    // 이미지 업로드가 완료되면 이미지 데이터를 다시 불러옴
    if (!showUploadForm) {
      fetchData();
    }
  }, [showUploadForm]);
  const imagePickerOption = {
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: false,
    quality: 0,
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
      );
    }
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
          setChosenImage(chosenImage);
          // console.log("🌄 저장한 이미지 -> ", chosenImage);
          setShowUploadForm(true);
        } else {
          console.log("No assets found!");
        }
      }
    } catch (error) {
      console.error("카메라 Error!!!!! : ", error);
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
        const result = await ImagePicker.launchImageLibraryAsync(
          imagePickerOption
        );
        // 이미지 업로드 취소한 경우
        if (result.canceled) {
          return null;
        }
        // 이미지 업로드 결과 및 이미지 경로 업데이트
        if (result.assets && result.assets.length > 0) {
          const chosenImage = result.assets[0];
          console.log("🌄 저장한 이미지 -> ", chosenImage);
          setChosenImage(chosenImage);
          setShowUploadForm(true);
        } else {
          console.log("No assets found!");
        }
      }
    } catch (error) {
      console.error("갤러리 Error!!!!! : ", error);
    }
  };
  const toggleTagSelection = (tagId) => {
    setSelectedTags((prevTags) => {
      const isSelected = prevTags.includes(tagId);
      if (isSelected) {
        return prevTags.filter((tag) => tag !== tagId);
      } else {
        return [...prevTags, tagId];
      }
    });
    // console.log("선택한 태그:", selectedTags);
  };
  const filterImages = () => {
    // console.log("선택한 태그:", selectedTags);
    if (selectedTags.length === 0) {
      // console.log("@@@@@@@ 정렬된 데이따", albumList.sort((a, b) => b.photoId - a.photoId));
      return albumList.sort((a, b) => b.photoId - a.photoId);
    }
    const filteredImages = albumList.filter((item) => {
      const hasMatchingTag = item.photoTags.some((tag) =>
        selectedTags.includes(tag)
      );
      // console.log(`Item ${item.photoId} - hasMatchingTag: ${hasMatchingTag}`);
      return hasMatchingTag;
    });
    // 내림차순 정렬
    const sortedImages = filteredImages.sort((a, b) => b.photoId - a.photoId);
    // console.log("@@@@@@@ 정렬된 데이따", sortedImages);
    return sortedImages;
  };
  useEffect(() => {
    // console.log("선택한 태그 (useEffect):", selectedTags);
  }, [selectedTags]);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        if (notification.request.content.title == "Family") {
          console.log("update Family");
        } else if (notification.request.content.title == "TMI") {
          console.log("update TMI");
        } else if (notification.request.content.title == "Calendar") {
          console.log("update Calendar");
        } else if (notification.request.content.title == "Photo") {
          console.log("update Photo");
          const fetchData = async () => {
            const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
            const UserServerAccessToken = await AsyncStorage.getItem(
              "UserServerAccessToken"
            );
            try {
              console.log(SERVER_ADDRESS);
              const response = await fetch(SERVER_ADDRESS + `/photo`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + UserServerAccessToken,
                },
              });

              const data = await response.json();
              // 받아온 이미지 데이터 상태에 저장
              setAlbumList(data.data);
              // console.log("받은 데이터!!!!!!!!!", data.data)
              // console.log("👉🏻앨범 이미지 리스트: ", data.data.map(item => item.photoKey));
            } catch (error) {
              console.error(
                "이미지 url을 가져오는 중에 오류가 발생했습니다.",
                error
              );
            }
          };
          // 이미지 업로드가 완료되면 이미지 데이터를 다시 불러옴
          if (!showUploadForm) {
            fetchData();
          }
        } else if (notification.request.content.title == "Plant") {
          console.log("update Plant");
        } else {
          console.log("update Chatting");
        }
      });
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
    };
  }, [notification]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
        const UserServerAccessToken = await AsyncStorage.getItem(
          "UserServerAccessToken"
        );
        try {
          console.log(SERVER_ADDRESS);
          const response = await fetch(SERVER_ADDRESS + `/photo`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + UserServerAccessToken,
            },
          });

          const data = await response.json();
          // 받아온 이미지 데이터 상태에 저장
          setAlbumList(data.data);
          // console.log("받은 데이터!!!!!!!!!", data.data)
          // console.log("👉🏻앨범 이미지 리스트: ", data.data.map(item => item.photoKey));
        } catch (error) {
          console.error(
            "이미지 url을 가져오는 중에 오류가 발생했습니다.",
            error
          );
        }
      };
      // 이미지 업로드가 완료되면 이미지 데이터를 다시 불러옴
      if (!showUploadForm) {
        fetchData();
      }
      // 여기에 다른 포커스를 받았을 때 실행하고 싶은 작업들을 추가할 수 있습니다.
      return () => {
        // 스크린이 포커스를 잃을 때 정리 작업을 수행할 수 있습니다.
      };
    }, []) // 두 번째 매개변수로 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행되도록 합니다.
  );

  return (
    <View style={styles.container}>
      {!showUploadForm ? (
        <Fragment>
          <View style={styles.tagContainer}>
            {TAG_OPTION.map((tag, index) => (
              <TouchableOpacity
                key={tag.id}
                style={[
                  styles.tagItem,
                  selectedTags.includes(tag.id) && styles.selectedTagItem,
                  index !== TAG_OPTION.length - 1 && { marginRight: 7 },
                ]}
                onPress={() => toggleTagSelection(tag.id)}
              >
                <Text
                  style={{
                    color: selectedTags.includes(tag.id) ? "black" : "black",
                    fontWeight: selectedTags.includes(tag.id)
                      ? "bold"
                      : "normal",
                  }}
                >
                  {tag.item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <FlatList
            numColumns={4}
            data={filterImages()}
            keyExtractor={(item) => item.photoId.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ImageDetailForm", {
                      photoInfo: {
                        photoId: item.photoId,
                        createAt: item.createAt,
                        photoKey: item.photoKey,
                        photoTags: item.photoTags,
                        description: item.description,
                        writer: item.writer,
                      },
                      albumList: albumList,
                    })
                  }
                >
                  <ExpoFastImage
                    uri={item.photoKey}
                    cacheKey={item.photoId.toString()}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.flatListContentContainer}
          />
          <TouchableOpacity
            style={styles.imagePlusContainer}
            onPress={modalOpen}
          >
            <Image
              source={require("../assets/img/plus.png")}
              style={{
                width: SCREEN_WIDTH * 0.13,
                height: SCREEN_WIDTH * 0.13,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        </Fragment>
      ) : (
        <ImageUploadForm
          uri={chosenImage.uri}
          onUploadComplete={handleUploadComplete}
        />
      )}
      <UploadModeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLaunchCamera={onLaunchCamera}
        onLaunchImageLibrary={onLaunchImageLibrary}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    position: "relative",
  },
  image: {
    width: SCREEN_WIDTH / 4 - 7, // 이미지의 가로 크기 (한 행에 4개씩 배치하고 간격 조절)
    height: SCREEN_WIDTH / 4 - 7, // 이미지의 세로 크기
  },
  imagePlusContainer: {
    position: "absolute",
    bottom: "4%",
    right: "5%",
  },
  imageContainer: {
    top: "1%",
    margin: 2,
  },
  tagContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  tagItem: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedTagItem: {
    borderColor: "#E0EBF2",
    backgroundColor: "#E0EBF2",
  },
  flatListContentContainer: {
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: "flex-start", // 세로 정렬을 상단으로 설정
    alignItems: "flex-start", // 가로 정렬을 좌측으로 설정
  },
});
