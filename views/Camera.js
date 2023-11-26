// import React, { useEffect, useRef, useState } from 'react';
// import { View, Pressable, Image, Text } from 'react-native';
// import { Camera, CameraType } from 'expo-camera';
// import * as MediaLibrary from 'expo-media-library';
// import Header from '../components/ui/Header';
// import Container from '../components/layout/Container';
// import Button from '../components/ui/buttons/Button';
// import { RootStackParamList } from '../types/navigation';
// import { StackScreenProps } from '@react-navigation/stack';
// import ArrowSwap from '../components/ui/icons/ArrowSwap';
// import Color from '../constants/color';
// import TYPOS from '../components/ui/typo';
//
// // StackScreenProps type
// type CameraProps = StackScreenProps<RootStackParamList, 'Camera'>;
//
// // Camera component
// const Camera = ({ navigation, route }) => {
//     // Ref for the camera component
//     const cameraRef = useRef(null);
//     // State to track camera permission status
//     const [hasPermission, setHasPermission] = useState(null);
//     // State to track the camera type (front/back)
//     const [type, setType] = useState(CameraType.back);
//     // State to store the captured photo
//     const [photo, setPhoto] = useState(null);
//     // Destructuring the callback function from the route parameters
//     const { callback } = route.params;
//
//     // Function to toggle between front and back camera
//     const changeType = () => {
//         if (type === CameraType.front) {
//             setType(CameraType.back);
//         } else {
//             setType(CameraType.front);
//         }
//     };
//
//     // Function to take a picture using the camera
//     const takePicture = async () => {
//         if (hasPermission) {
//             if (cameraRef.current) {
//                 const photo = await cameraRef.current.takePictureAsync();
//                 setPhoto(photo);
//             }
//         } else {
//             const { status } = await Camera.requestCameraPermissionsAsync();
//             setHasPermission(status === 'granted');
//         }
//     };
//
//     // Function to save the captured picture to the camera roll
//     const savePicture = async () => {
//         if (photo) {
//             const { status } = await MediaLibrary.requestPermissionsAsync();
//
//             if (status === 'granted') {
//                 const asset = await MediaLibrary.createAssetAsync(photo.uri);
//                 retakePicture();
//                 try {
//                     await MediaLibrary.createAlbumAsync('Camera', asset, false);
//                 } catch (error) {
//                     console.error(
//                         'An error occurred while saving the photo to the camera roll:',
//                         error
//                     );
//                 }
//             }
//         }
//     };
//
//     // Function to retake a picture
//     const retakePicture = () => {
//         setPhoto(null);
//     };
//
//     // Effect to request camera permissions when the component mounts
//     useEffect(() => {
//         const getCameraPermission = async () => {
//             const { status } = await Camera.requestCameraPermissionsAsync();
//             setHasPermission(status === 'granted');
//         };
//
//         getCameraPermission();
//     }, []);
//
//     // Effect to run the callback when the component unmounts
//     useEffect(() => {
//         return () => {
//             callback();
//         };
//     }, []);
//
//     // Rendering the component
//     return (
//         <>
//             <Header title='사진 촬영' />
//             <Container>
//                 {hasPermission && (
//                     <>
//                         {!photo ? (
//                             <>
//                                 <Camera
//                                     style={{ flex: 1, position: 'relative' }}
//                                     ref={cameraRef}
//                                     type={type}
//                                 >
//                                     <View
//                                         style={{
//                                             position: 'absolute',
//                                             right: 16,
//                                             top: 16,
//                                         }}
//                                     >
//                                         <Pressable style={{}} onPress={changeType}>
//                                             <ArrowSwap size={36} color={Color.white} />
//                                         </Pressable>
//                                     </View>
//                                 </Camera>
//                                 <Button label='촬영' onPressHandler={takePicture} />
//                             </>
//                         ) : (
//                             <>
//                                 <View
//                                     style={{
//                                         flex: 1,
//                                         justifyContent: 'center',
//                                         alignItems: 'center',
//                                     }}
//                                 >
//                                     <Image
//                                         source={{ uri: photo.uri }}
//                                         style={{ flex: 1, width: '100%' }}
//                                         resizeMode='contain'
//                                     />
//                                     <View
//                                         style={{
//                                             flexDirection: 'row',
//                                             width: '100%',
//                                             justifyContent: 'space-between',
//                                             marginTop: 16,
//                                             paddingHorizontal: 16,
//                                         }}
//                                     >
//                                         <Pressable onPress={retakePicture}>
//                                             <Text style={TYPOS.headline3}>다시 찍기</Text>
//                                         </Pressable>
//                                         <Pressable onPress={savePicture}>
//                                             <Text style={TYPOS.headline3}>저장</Text>
//                                         </Pressable>
//                                     </View>
//                                 </View>
//                             </>
//                         )}
//                     </>
//                 )}
//             </Container>
//         </>
//     );
// };
//
// // Exporting the Camera component
// export default Camera;
