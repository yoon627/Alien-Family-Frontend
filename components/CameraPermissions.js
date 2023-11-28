import { useCameraPermissions } from 'expo-image-picker';

export default function CameraPermissions() {
  // 카메라 권한 요청을 위한 훅
  const [cameraStatus, cameraRequestPermission] = useCameraPermissions();
  return { cameraStatus, cameraRequestPermission };
}