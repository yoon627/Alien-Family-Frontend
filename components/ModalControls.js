import { Platform, ActionSheetIOS } from 'react-native';
import {useState} from "react";

export default function ModalControls({ onLaunchCamera, onLaunchImageLibrary }) {
  // 안드로이드를 위한 모달 visible 상태값
  // const [modalVisible, setModalVisible] = useState(false);

  // 선택 모달 오픈
  const modalOpen = () => {
    if (Platform.OS === 'android') {
      setModalVisible(true);
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['사진 찍기', '카메라롤에서 선택하기', '취소'],
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

  return { modalOpen };
}
