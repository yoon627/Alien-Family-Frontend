import { useEffect, useState } from 'react';

export default function ImageFetcher() {
  // 앨범에 보여줄 이미지 목록 (s3에서 불러온 이미지들)
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    // 서버에서 s3 이미지 url 받아옴
    const fetchData = async () => {
      try {
        const response = await fetch('서버에서 이미지 url을 제공하는 주소');
        const data = await response.json();
        // 받아온 이미지 데이터 상태에 저장
        setImageData(data);
      } catch (error) {
        console.error('🥲 이미지 url을 가져오는 중에 오류가 발생했습니다.', error);
      }
    };
    // 데이터 불러오기
    fetchData();
  }, []);

  return imageData;
}
