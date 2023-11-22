import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    ImageBackground,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import LottieView from 'lottie-react-native';
import AlienSvg from '../AlienSvg';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");

export default function MiniGames({navigation}) {
    const [characterPosition, setCharacterPosition] = useState({x: 200, y: 200});
    const [showButton, setShowButton] = useState({
        ladder: false, mole: false, roulette: false, door: false,
    });

    const SOME_THRESHOLD = 160;
    const maxDistance = 30;
    const sensitivity = 1;  // 조이스틱 민감도 조절 (낮을수록 더 민감)

    const joystickPosition = useRef(new Animated.ValueXY()).current;
    const panResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true, onPanResponderMove: (evt, gestureState) => {
            // 조이스틱이 최대 거리를 넘지 않도록 제한
            const distance = Math.sqrt(Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2));
            const angle = Math.atan2(gestureState.dy, gestureState.dx);
            const x = distance > maxDistance ? maxDistance * Math.cos(angle) : gestureState.dx;
            const y = distance > maxDistance ? maxDistance * Math.sin(angle) : gestureState.dy;

            joystickPosition.setValue({x, y});
        }, onPanResponderRelease: () => {
            Animated.spring(joystickPosition, {
                toValue: {x: 0, y: 0}, friction: 5, useNativeDriver: false
            }).start();
        }
    })).current;

    useEffect(() => {
        joystickPosition.addListener(position => {
            // 조이스틱 움직임에 따라 캐릭터 위치 업데이트
            const deltaX = position.x * 0.1;
            const deltaY = -position.y * 0.1;
            // ... 캐릭터 위치 업데이트 로직 ...
            setCharacterPosition((prevPosition) => ({
                x: Math.max(0, Math.min(prevPosition.x + deltaX, SCREEN_WIDTH - SCREEN_WIDTH * 0.12)),
                y: Math.max(0, Math.min(prevPosition.y - deltaY, SCREEN_HEIGHT - SCREEN_HEIGHT * 0.1)),
            }));
        });

        return () => {
            joystickPosition.removeAllListeners();
        };
    }, []);

    // 게임 이미지 & 캐릭터 사이 거리 계산
    const calculateDistance = (pos1, pos2) => {
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
    };

    useLayoutEffect(() => {
        const gameImgPosition = {
            ladder: {x: SCREEN_WIDTH * 0.018, y: SCREEN_HEIGHT * 0.14},
            mole: {x: SCREEN_WIDTH * 0.9, y: SCREEN_HEIGHT * 0.2},
            roulette: {x: SCREEN_WIDTH * 0.3, y: SCREEN_HEIGHT * 0.6},
            door: {x: SCREEN_WIDTH * 0.95, y: SCREEN_HEIGHT * 0.65}
        };

        const updatedShowButton = {};

        Object.keys(gameImgPosition).forEach((button) => {
            const distance = calculateDistance(characterPosition, gameImgPosition[button]);
            updatedShowButton[button] = distance < SOME_THRESHOLD;
        });

        setShowButton(updatedShowButton);
    }, [characterPosition]);


    return (<View style={styles.container}>
        <ImageBackground
            // source={require('../assets/img/Background.png')}
            style={styles.bgImage}
        >
            <View style={styles.doorForm}>
                <Image
                    style={styles.door}
                    source={require('../assets/img/close_door.png')}/>
            </View>
            {showButton.door ? (<Animated.View style={styles.spaceshipForm}>
                <TouchableOpacity onPress={() => {
                    Alert.alert("맵을 나가시겠습니까?", null, [{
                        text: "취소", style: "cancel",
                    }, {
                        text: "나가기", onPress: () => {
                            navigation.navigate("Home")
                        }
                    },]);
                }}>
                    <LottieView
                        style={styles.spaceship}
                        source={require('../assets/json/open_door.json')}
                        loop
                        autoPlay
                    />
                </TouchableOpacity>
            </Animated.View>) : null}

            <View style={styles.ladderForm}>
                <Image
                    style={styles.ladder}
                    source={require('../assets/img/ladder.png')}
                />
            </View>

            {showButton.ladder ? (<View style={styles.spaceshipForm}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("Ladder")
                }}>
                    <Image
                        style={styles.ladder}
                        source={require('../assets/img/ladder.png')}
                    />
                    <Text
                        style={styles.buttonText}>
                    </Text>
                </TouchableOpacity>
            </View>) : null}

            <View style={styles.moleForm}>
                <Image
                    style={styles.mole}
                    source={require('../assets/img/mole.png')}
                />
            </View>

            {showButton.mole ? (<View style={styles.spaceshipForm}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("Mole")
                }}>
                    <Image
                        style={styles.mole}
                        source={require('../assets/img/mole.png')}
                    />
                    <Text
                        style={styles.buttonText}>
                    </Text>
                </TouchableOpacity>
            </View>) : null}

            <View style={styles.joystickArea}>
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[joystickPosition.getLayout(), styles.joystick]}
                />
            </View>

            <Animated.View style={styles.rouletteForm}>
                <LottieView
                    style={styles.roulette}
                    source={require('../assets/json/roulette.json')}
                    autoPlay
                    loop
                />
            </Animated.View>

            {showButton.roulette ? (<View style={styles.spaceshipForm}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("Roulette")
                }}>
                    <LottieView
                        style={styles.roulette}
                        source={require('../assets/json/roulette.json')}
                        autoPlay
                        loop
                    />
                    <Text
                        style={styles.buttonText}>
                    </Text>
                </TouchableOpacity>
            </View>) : null}

            <View style={{
                left: characterPosition.x,
                top: characterPosition.y,
                width: SCREEN_WIDTH * 0.1,
                height: SCREEN_WIDTH * 0.1,
                resizeMode: "contain"
            }}>
                <AlienSvg/>
            </View>

            <StatusBar style="auto"/>
        </ImageBackground>
    </View>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1, alignItems: "center", justifyContent: 'center',
    }, bgImage: {
        width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: "#000000",
    }, ladderForm: {
        position: "absolute", left: -SCREEN_WIDTH * 0.018, top: SCREEN_HEIGHT * 0.1,
    }, ladder: {
        width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.07, resizeMode: "contain",
    }, moleForm: {
        position: "absolute", right: SCREEN_WIDTH * 0.05, top: SCREEN_HEIGHT * 0.2,
    }, mole: {
        width: SCREEN_WIDTH * 0.15, height: SCREEN_HEIGHT * 0.08, resizeMode: "contain",
    }, rouletteForm: {
        position: "absolute", left: SCREEN_WIDTH * 0.3, bottom: SCREEN_HEIGHT * 0.3,
    }, roulette: {
        width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.08, resizeMode: "contain",
    }, doorForm: {
        position: "absolute", right: -SCREEN_WIDTH * 0.02, bottom: SCREEN_HEIGHT * 0.25,
    }, door: {
        width: SCREEN_WIDTH * 0.17, height: SCREEN_HEIGHT * 0.17, opacity: 0.5, resizeMode: "contain",
    }, spaceshipForm: {
        position: "absolute", right: "10%", bottom: "9%",
    }, spaceship: {
        width: SCREEN_WIDTH * 0.1,
        height: SCREEN_HEIGHT * 0.1,
        resizeMode: "contain", // shadowColor: 'lightyellow', // 그림자 색상
        // shadowOffset: {width: 2, height: 2},
        // shadowOpacity: 1,
        // shadowRadius: 2,
    }, joystickArea: {
        position: "absolute", left: "15%", bottom: "17%",
    }, joystick: {
        position: 'absolute',
        width: SCREEN_WIDTH * 0.13,
        height: SCREEN_WIDTH * 0.13,
        borderRadius: SCREEN_WIDTH * 0.13 / 2,
        backgroundColor: "rgba(255, 255, 255, 0.5)", // 조이스틱 색상
        // shadowColor: 'white', // 그림자 색상
        // shadowOffset: {width: 3, height: 3},
        // shadowOpacity: 1,
        // shadowRadius: 6,
        elevation: 30,
    },
});
