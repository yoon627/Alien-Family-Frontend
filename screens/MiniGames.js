import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    Alert,
    Animated,
    Button,
    Dimensions,
    Image,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    PanResponder,
    View
} from 'react-native';
import LottieView from 'lottie-react-native';
import AlienSvg from '../AlienSvg';
import { KorolJoystick } from "korol-joystick";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ladderScreen from "../views/LadderScreen";

const Tab = createBottomTabNavigator();

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function MiniGames({ navigation }) {

    const [characterPosition, setCharacterPosition] = useState({ x: 0, y: 0 });
    const [showButton, setShowButton] = useState({
        ladder: false,
        mole: false,
        roulette: false,
    });

    const SOME_THRESHOLD = 160;

    const sensitivity = 1;  // 조이스틱 민감도 조절 (낮을수록 더 민감)

    const joystickPosition = useRef(new Animated.ValueXY()).current;
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([
                null,
                { dx: joystickPosition.x, dy: joystickPosition.y }
            ], { useNativeDriver: false }),
            onPanResponderRelease: () => {

                console.log("x =",joystickPosition.x,"y = " ,joystickPosition.y);

                Animated.spring(joystickPosition, {
                    toValue: { x: 0, y: 0 },
                    friction: 5,
                    useNativeDriver: false
                }).start();
            }
        })
    ).current;

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

    const calculateDistance = (pos1, pos2) => {
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
    };

    useLayoutEffect(() => {
        const buttonPosition = {
            ladder: { x: SCREEN_WIDTH * 0.018, y: SCREEN_HEIGHT * 0.1 },
            mole: { x: SCREEN_WIDTH * 0.95, y: SCREEN_HEIGHT * 0.2 },
            roulette: { x: SCREEN_WIDTH * 0.3, y: SCREEN_HEIGHT * 0.5 },
        };

        const updatedShowButton = {};

        Object.keys(buttonPosition).forEach((button) => {
            const distance = calculateDistance(characterPosition, buttonPosition[button]);
            updatedShowButton[button] = distance < SOME_THRESHOLD;
        });

        setShowButton(updatedShowButton);
    }, [characterPosition]);


    return (
        <View style={styles.container}>
            <ImageBackground
                // source={require('../assets/img/Background.png')}
                style={styles.bgImage}
            >
                <View style={styles.doorForm}>
                    <TouchableOpacity onPress={
                        () => {
                            Alert.alert("맵을 나가시겠습니까?", null, [
                                {
                                    text: "취소",
                                    style: "cancel",
                                },
                                {
                                    text: "나가기",
                                    onPress: () => {
                                        navigation.navigate("Home")
                                    }
                                },
                            ]);
                        }}>
                        <Image
                            style={styles.door}
                            source={require('../assets/img/door.png')} />
                    </TouchableOpacity>
                </View>

                <View style={styles.ladderForm}>
                    <TouchableOpacity onPress={
                        () => navigation.navigate("Ladder")
                    }>
                        <Image
                            style={styles.ladder}
                            source={require('../assets/img/ladder.png')}
                        />
                        {showButton.ladder ? (
                            <Button
                                title='게임 접속하기'
                                onPress={() => {
                                    navigation.navigate("Ladder")
                                }}
                            />
                        ) : null}
                    </TouchableOpacity>
                </View>

                <View style={styles.moleForm}>
                    <TouchableOpacity onPress={
                        () => navigation.navigate("Mole")
                    }>
                        <Image
                            style={styles.mole}
                            source={require('../assets/img/mole.png')}
                        />
                        {showButton.mole ? (
                            <Button
                                title='게임 접속하기'
                                onPress={() => {
                                    navigation.navigate("Mole")
                                }}
                            />
                        ) : null}
                    </TouchableOpacity>
                </View>

                <View style={styles.joystickArea}>
                    <Animated.View
                        {...panResponder.panHandlers}
                        style={[joystickPosition.getLayout(), styles.joystick]}
                    />
                </View>

                <Animated.View style={styles.rouletteForm}>
                    <TouchableOpacity onPress={
                        () => {
                            navigation.navigate("Roulette")
                        }}>
                        <LottieView
                            style={styles.roulette}
                            source={require('../assets/json/roulette.json')}
                            autoPlay
                            loop
                        />
                        {showButton.roulette ? (
                            <Button
                                title='게임 접속하기'
                                onPress={() => {
                                    navigation.navigate("Roulette")
                                }}
                            />
                        ) : null}
                    </TouchableOpacity>
                </Animated.View>

                <View style={{
                    left: characterPosition.x,
                    top: characterPosition.y,
                    width: SCREEN_WIDTH * 0.1,
                    height: SCREEN_WIDTH * 0.1,
                    resizeMode: "contain"
                }}>
                    <AlienSvg />
                </View>

                <StatusBar style="auto" />
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'center',
    },
    bgImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "#000000",
    },
    ladderForm: {
        position: "absolute",
        left: -SCREEN_WIDTH * 0.018,
        top: SCREEN_HEIGHT * 0.1,
    },
    ladder: {
        width: SCREEN_WIDTH * 0.2,
        height: SCREEN_HEIGHT * 0.15,
        resizeMode: "contain",
    },
    moleForm: {
        position: "absolute",
        right: SCREEN_WIDTH * 0.05,
        top: SCREEN_HEIGHT * 0.2,
    },
    mole: {
        width: SCREEN_WIDTH * 0.1,
        height: SCREEN_HEIGHT * 0.15,
        resizeMode: "contain",
    },
    rouletteForm: {
        position: "absolute",
        left: SCREEN_WIDTH * 0.3,
        bottom: SCREEN_HEIGHT * 0.3,
    },
    roulette: {
        width: SCREEN_WIDTH * 0.1,
        height: SCREEN_HEIGHT * 0.1,
        resizeMode: "contain",
    },
    joystickArea: {
        position: 'absolute',
        left: 50,
        bottom: 30,
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    joystick: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        backgroundColor: '#1E90FF', // 조이스틱 색상
        borderWidth: 2,
        borderColor: '#FFFFFF', // 조이스틱 테두리 색상
        shadowColor: '#000000', // 그림자 색상
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 5,
        position: 'absolute',
    },
    doorForm: {
        position: "absolute",
        right: -SCREEN_WIDTH * 0.02,
        bottom: SCREEN_HEIGHT * 0.05,
    },
    door: {
        width: SCREEN_WIDTH * 0.17,
        height: SCREEN_HEIGHT * 0.17,
        resizeMode: "contain",
    },
});