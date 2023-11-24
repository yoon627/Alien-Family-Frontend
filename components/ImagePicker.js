import React, {useEffect, useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {Button, Image, TouchableOpacity} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ImagePickerComponent = () => {
    // 권한 요청을 위한 훅
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    // 현재 이미지 주소
    const [imageUrl, setImageUrl] = useState('');
    // 이미지 리스트
    // const [photos, setPhotos] = useState([]);
    //
    // useEffect(() => {
    //     setPhotos();
    // }, [imageUrl]);

    const uploadImage = async () => {
        // 권한 확인 (권한 없으면 물어보고, 승인하지 않으면 함수 종료)
        if (!status?.granted) {
            const permission = await requestPermission();
            if (!permission.granted) {
                return null;
            }
        }
        // 이미지 업로드
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: false,
                quality: 1,
                aspect: [1, 1],
            });
            // 이미지 업로드 취소한 경우
            if (result.canceled) {
                return null;
            }
            // 이미지 업로드 결과 및 이미지 경로 업데이트
            if (result.assets && result.assets.length > 0) {
                console.log(result);
                const uri = result.assets[0].uri;
                setImageUrl(uri);
                console.log(imageUrl);

                // 서버에 요청 보내기
                // const filename = uri.split('/').pop();
                // const type = match ? `image/${match[1]}` : `image`;
                // const match = /\/.(\w+)$/.exec(filename || '');

                const filename = result.assets[0].fileName;
                const type = result.assets[0].type;
                const formData = new FormData();
                formData.append('image', {
                    uri: uri,
                    type: type,
                    name: filename});

                const access_token = await AsyncStorage.getItem("ServerAccessToken");

                const response = await axios({
                    method: 'post',
                    url: '',
                    headers: {
                        'content-type': 'multipart/form-data',
                        'Authorization': `Bearer ${access_token}`
                    },
                    data: formData
                })

                // 서버 응답
                console.log("👉🏻 서버 응답: ", response.data);

            } else {
                console.log("No assets found!");
            }
        } catch (err) {
            console.log(err);
        }

    };

    return (
        // <View>
        <TouchableOpacity>
            <Button
                title='이미지 업로드 하기'
                onPress={uploadImage}
            />
            <Image
                source={{uri: imageUrl}}
            />
        </TouchableOpacity>
        // </View>
    );
};

export default ImagePickerComponent;