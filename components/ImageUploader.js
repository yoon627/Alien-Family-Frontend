import AsyncStorage from '@react-native-async-storage/async-storage';

// 클라에서 바로 presigned url로 업로드
// 1단계: signed url을 요청해서 받는다.
// 2단계: 받아온 url에 put으로 요청해서 업로드한다.
export default async function ImageUploader(chosenImage, uri){
  // 서버로 전송될 파일의 이름과 타입 지정
  const body = {
    fileName: uri.substring(uri.lastIndexOf('/') + 1),
    prefix: "photoAlbum",
    photoTags: "DAD"
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
