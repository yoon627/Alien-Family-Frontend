import React, {useEffect, useRef, useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {
    Alert,
    Animated,
    Button,
    Dimensions,
    Image,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import LottieView from 'lottie-react-native';
import AlienSvg from '../AlienSvg';
import {KorolJoystick} from "korol-joystick";
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ladderScreen from "../views/LadderScreen";

const Tab = createBottomTabNavigator();

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");

export default function MiniGames({navigation}) {
    const [characterPosition, setCharacterPosition] = useState({x: 200, y: 200});
    const imageRef = useRef(null);

    const [showLadderButton, setShowLadderButton] = useState(false);
    const [showMoleButton, setShowMoleButton] = useState(false);
    const [showRouletteButton, setShowRouletteButton] = useState(false);

    const SOME_THRESHOLD = 200;

    const LADDER_POSITION = {
        x: -SCREEN_WIDTH * 0.018,
        y: SCREEN_HEIGHT * 0.1
    };

    const MOLE_POSITION = {
        x: SCREEN_WIDTH * 0.95,
        y: SCREEN_HEIGHT * 0.2
    };
    const ROULETTE_POSITION = {
        x: SCREEN_WIDTH * 0.3,
        y: SCREEN_HEIGHT * 0.7
    };


// 캐릭터와 'ladder' 간 거리 계산 함수
    const calculateDistance = (pos1, pos2) => {
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
    };


    // 캐릭터 이동시키는 로직
    const handleJoystickMove = (e) => {
        // 각도를 이용하여 이동 방향 계산
        const angleInRadian = e.angle.radian;
        const deltaX = e.force * Math.cos(angleInRadian) * 4;
        const deltaY = e.force * Math.sin(angleInRadian) * 4;

        // 현재 캐릭터 위치에서 이동
        setCharacterPosition((prevPosition) => ({
            x: Math.max(0, Math.min(prevPosition.x + deltaX, SCREEN_WIDTH - SCREEN_WIDTH * 0.12)),
            y: Math.max(0, Math.min(prevPosition.y - deltaY, SCREEN_HEIGHT - SCREEN_HEIGHT * 0.1)),
        }));

    };

    useEffect(() => {
        const distanceToMole = calculateDistance(characterPosition, MOLE_POSITION);
        const distanceToRoulette = calculateDistance(characterPosition, ROULETTE_POSITION);
        const distanceToLadder = calculateDistance(characterPosition, LADDER_POSITION);



        if (distanceToLadder < SOME_THRESHOLD) {
            setShowLadderButton(true);
        } else {
            setShowLadderButton(false);
        }


        if (distanceToMole < SOME_THRESHOLD) {
            setShowMoleButton(true);
        } else {
            setShowMoleButton(false);
        }

        if (distanceToRoulette < SOME_THRESHOLD) {
            setShowRouletteButton(true);
        } else {
            setShowRouletteButton(false);
        }
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
                            source={require('../assets/img/door.png')}/>
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
                        {showLadderButton ? (
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
                        {showMoleButton ? (
                            <Button
                                title='게임 접속하기'
                                onPress={() => {
                                    navigation.navigate("Mole")
                                }}
                            />
                        ) : null}
                    </TouchableOpacity>
                </View>

                <GestureHandlerRootView
                    style={styles.joystick}
                >
                    <KorolJoystick
                        color="#FFFFFF"
                        radius={70}
                        onMove={handleJoystickMove}
                    />
                </GestureHandlerRootView>

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
                        {showRouletteButton ? (
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
                    <AlienSvg/>
                </View>

                <StatusBar style="auto"/>
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
        height: SCREEN_HEIGHT * 0.13,
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
    joystick: {
        position: "absolute",
        left: 30,
        bottom: 30,
    },
    doorForm: {
        position: "absolute",
        right: -SCREEN_WIDTH * 0.02,
        bottom: SCREEN_HEIGHT * 0.05,
    },
    door: {
        width: SCREEN_WIDTH * 0.15,
        height: SCREEN_HEIGHT * 0.15,
        resizeMode: "contain",
    },
});