import React, {useState} from "react";
import {View, Pressable, StyleSheet, TouchableOpacity, Button} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UploadModeModal from "../components/UploadModeModal";
import {ImagePlus} from "lucide-react-native";

export default function ImageUploadPage() {
    // file 데이터 (S3에 실제로 업로드 되는 파일)
    const [image, setImage] = useState(null);

    // 클라에서 바로 presigned url로 업로드
    // 1단계: signed url을 요청해서 받는다.
    // 2단계: 받아온 url에 put으로 요청해서 업로드한다.
    const uploadToServer = async () => {
        // 서버로 전송될 파일의 이름과 타입 지정
        const body = {
            name: "client/" + Math.random().toString(36).substring(2, 11) + image.name,
            type: image.type,
        };

        try {
            // 1단계: 서버에 presigned url 요청
            const urlRes = await fetch(``, {
                method: 'POST',
                body: JSON.stringify(body),
            });
            const data = await urlRes.json();
            const signedUrl = data.url;
            console.log(signedUrl);

            // 2단계: 이미지를 해당 url에 put (upload)
            // 이미 파일 이름이나 경로 등은 url 받아올 때 지정해놨으므로 image 파일 객체와 content-type 정보만 넣어서 보냄
            const access_token = await AsyncStorage.getItem("ServerAccessToken");
            const uploadRes = await fetch(signedUrl, {
                method: 'PUT',
                body: image,
                headers: {
                    'Content-type': image.type,
                    'Authorization': `Bearer ${access_token}`
                },
            });
            // 서버 응답 확인
            console.log(uploadRes);

            // 서버 응답이 성공적인지 확인하고 필요한 처리 수행
            if (uploadRes.ok) {
                console.log("👌🏻이미지 업로드 성공");
            } else {
                console.error("❌이미지 업로드 실패");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <Button title='업로드 하기' onPress={uploadToServer}/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});