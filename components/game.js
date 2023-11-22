import React, {useEffect, useRef, useState} from 'react';
import {Alert, Animated, Button, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const GRID_SIZE = 6;
const MOLE_APPEAR_DURATION = 500;
const BOMB_APPEAR_DURATION = 500; // 폭탄이 나타나는 시간
const SPECIAL_BLOCK_APPEAR_DURATION = 500; // 3점짜리 블록이 나타나는 시간 간격
const GAME_DURATION = 20000; // 1분
const BOMB_PENALTY = 1; // 폭탄 버튼 점수 패널티
const SPECIAL_BLOCK_POINTS = 3;

// 화면 크기에 따라 그리드 크기 조정
const windowWidth = Dimensions.get('window').width;
const MAX_GRID_WIDTH = 700; // 최대 그리드 크기 (예: 400픽셀)
const gridWidth = Math.min(windowWidth * 0.8, MAX_GRID_WIDTH); // 화면 너비의 80% 혹은 최대 크기 중 작은 값
const cellSize = gridWidth / GRID_SIZE; // 각 격자 칸의 크기
const gaugeContainerWidth = windowWidth * 0.8; // 게이지 컨테이너 너비

const MoleGame = () => {
    const [activeMole, setActiveMole] = useState(null);
    const [activeBombs, setActiveBombs] = useState([]);
    const [activeSpecialBlock, setActiveSpecialBlock] = useState(null); // 3점짜리 블록
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [gameStarted, setGameStarted] = useState(false); // 게임 시작 상태
    const [gameActive, setGameActive] = useState(false);

    const timerLeft = useRef(new Animated.Value(GAME_DURATION)).current; // Animated.Value로 타이머 상태 관리
    const gifImageUri = 'https://media1.giphy.com/media/l3vR1tookIhM8nZJu/giphy.gif?cid=ecf05e472i45sfi0af5g4ga6cnv3rgtke2gfv21bb9nb1bqq&ep=v1_gifs_search&rid=giphy.gif&ct=g'; // GIF 이미지 URL

    useEffect(() => {
        // 타이머 애니메이션 시작
        Animated.timing(timerLeft, {
            toValue: 0, // 타이머가 0에 도달할 때까지
            duration: GAME_DURATION, // 게임 시간 동안
            useNativeDriver: false // 네이티브 드라이버 사용 여부
        }).start();
    }, []);

    // 타이머 게이지의 너비를 계산


    const moleImageUri = 'https://i.namu.wiki/i/aJtwJmF0Ece9P0cM6dEahMsHi76985s26uZY4fAY-ROVpyGH2eGsAVR09PfNZeygyToACJJl97M-_wYr5bzNyVivyPcuirmUJuguUEJJfG0el3DGDSxlxWAoLkCSR9-P6ArWIeb1RwWl2Ni_D875CQ.webp'; // 두더지 이미지 경로
    const bombImageUri = 'https://cdn.011st.com/11dims/resize/600x600/quality/75/11src/product/5321793482/B.jpg?499000000'; // 폭탄 이미지 경로
    const specialBlockImageUri = 'https://static.wikia.nocookie.net/pokemon/images/1/13/%EB%8B%A5%ED%8A%B8%EB%A6%AC%EC%98%A4_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20170405005841&path-prefix=ko'; // 3점짜리 블록 이미지 경로

    const getRandomNumbers = () => {
        const availableNumbers = Array.from({length: 36}, (_, i) => i);
        const randomNumbers = [];
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            randomNumbers.push(availableNumbers.splice(randomIndex, 1)[0]);
        }
        return randomNumbers;
    };

    useEffect(() => {
        if (!gameActive) return;
        let randomNumbers = getRandomNumbers();

        const Interval = setInterval(() => {
            randomNumbers = getRandomNumbers();
        }, MOLE_APPEAR_DURATION);

        const moleInterval = setInterval(() => {
            const nextMole = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
            setActiveMole(randomNumbers[0]);
        }, MOLE_APPEAR_DURATION);

        const bombInterval = setInterval(() => {
            const nextBombs = new Array(3).fill(null).map(() => Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE)));
            setActiveBombs(randomNumbers.slice(1, 4));
        }, BOMB_APPEAR_DURATION);

        const specialBlockInterval = setInterval(() => {
            const nextSpecialBlock = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
            setActiveSpecialBlock(randomNumbers[4]);
        }, SPECIAL_BLOCK_APPEAR_DURATION);


        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 0) {
                    clearInterval(moleInterval);
                    clearInterval(bombInterval);
                    clearInterval(specialBlockInterval);
                    clearInterval(Interval);
                    clearInterval(timer);
                    setGameActive(false);
                    return 0;
                }
                return prevTime - 1000;
            });
        }, 1000);

        return () => {
            clearInterval(moleInterval);
            clearInterval(bombInterval);
            clearInterval(specialBlockInterval);
            clearInterval(Interval);
            clearInterval(timer);
        };
    }, [gameActive]);

    useEffect(() => {
        if (!gameActive && gameStarted) {
            Alert.alert("게임 종료!", `당신의 점수는 ${score}점입니다.`);
        }
    }, [gameActive, score]);

    const handlePress = (index) => {
        if (index === activeMole && gameActive) {
            setScore(score + 1);
            setActiveMole(null);
        } else if (activeBombs.includes(index) && gameActive) {
            setScore(Math.max(score - BOMB_PENALTY, 0));
            setActiveBombs(prev => prev.filter(bombIndex => bombIndex !== index));
        } else if (index === activeSpecialBlock && gameActive) {
            setScore(score + SPECIAL_BLOCK_POINTS);
            setActiveSpecialBlock(null);
        }
    };


    // 게임 시작 함수
    const startGame = () => {
        setGameActive(true);
        setGameStarted(true);
        setTimeLeft(GAME_DURATION);
        setScore(0);


        // 애니메이션 시작
        Animated.timing(timerLeft, {
            toValue: 0, duration: GAME_DURATION, useNativeDriver: false
        }).start();
    };

    const timeGaugeWidth = timerLeft.interpolate({
        inputRange: [0, GAME_DURATION], outputRange: [0, windowWidth * 0.8], // 화면 너비의 80%로 설정
        extrapolate: 'clamp'
    });

    const gifPosition = timerLeft.interpolate({
        inputRange: [0, GAME_DURATION], outputRange: [-25, gaugeContainerWidth - 25], // GIF 이미지 크기의 절반만큼 보정
        extrapolate: 'clamp'
    });

    const restartGame = () => {
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setGameActive(true);

        // timerLeft를 GAME_DURATION으로 재설정
        timerLeft.setValue(GAME_DURATION);

        // 애니메이션 재시작
        Animated.timing(timerLeft, {
            toValue: 0, duration: GAME_DURATION, useNativeDriver: false
        }).start();
    };

    return (<View style={styles.container}>

        {gameStarted && (<>
            <View style={styles.timeGaugeContainer}>
                <Animated.View style={[styles.timeGauge, {width: timeGaugeWidth, right: 0}]}/>
            </View>
            <Animated.Image
                source={{uri: gifImageUri}}
                style={[styles.gifImage, {left: gifPosition}]}
            />

            <Text style={styles.timerText}>남은 시간: {Math.round(timeLeft / 1000)}초</Text>
            <Text style={styles.scoreText}>점수: {score}</Text>

        </>)}
        <View style={[styles.grid, {width: gridWidth, height: gridWidth}]}>
            {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => (<TouchableOpacity
                key={index}
                // style={styles.moleHole}
                style={[styles.moleHole, {width: cellSize, height: cellSize}]}
                onPress={() => handlePress(index)}
            >
                {activeMole === index && gameActive && (<Image
                    source={{uri: moleImageUri}}
                    style={styles.moleImage}
                />)}
                {activeBombs.includes(index) && gameActive && (<Image
                    source={{uri: bombImageUri}}
                    style={styles.moleImage}
                />)}
                {activeSpecialBlock === index && gameActive && (
                    <Image source={{uri: specialBlockImageUri}} style={styles.moleImage}/>)}
            </TouchableOpacity>))}
        </View>

        {!gameActive && (
            <Button title={gameStarted ? "게임 재시작" : "게임 시작"} onPress={gameStarted ? restartGame : startGame}/>)}

    </View>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1, alignItems: 'center', justifyContent: 'center'
    }, timeGaugeContainer: {
        height: 20, backgroundColor: 'lightgray', overflow: 'hidden', width: windowWidth * 0.8, marginBottom: 20
    }, timeGauge: {
        height: '100%', backgroundColor: 'lightgreen'
    }, scoreText: {
        fontSize: 24, marginBottom: 20
    }, grid: {
        flexDirection: 'row', flexWrap: 'wrap', // width: 600, // 격자 크기 조정
    }, moleHole: {
        borderWidth: 1, borderColor: 'black'
    }, moleImage: {
        width: '100%', height: '100%'
    }, activeMole: {
        backgroundColor: 'brown' // 두더지 색상
    }, timerText: {
        fontSize: 20, marginBottom: 10
    }, gifImage: {
        width: 50, height: 50, position: 'absolute', top: 100, // 게이지 바 위에 위치
        right: 0
    }
});

export default MoleGame;