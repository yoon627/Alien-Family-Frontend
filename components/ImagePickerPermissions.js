import { useMediaLibraryPermissions } from 'expo-image-picker';

export default function ImagePickerPermissions() {
  // 앨범 권한 요청을 위한 훅
  const [albumStatus, albumRequestPermission] = useMediaLibraryPermissions();
  return { albumStatus, albumRequestPermission };
}