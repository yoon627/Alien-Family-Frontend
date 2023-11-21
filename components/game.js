import React, {useEffect, useRef, useState} from 'react';
import {Alert, Animated, Button, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const GRID_SIZE = 6;
const MOLE_APPEAR_DURATION = 800;
const BOMB_APPEAR_DURATION = 500; // 폭탄이 나타나는 시간
const SPECIAL_BLOCK_APPEAR_DURATION = 1000; // 3점짜리 블록이 나타나는 시간 간격
const GAME_DURATION = 20000; // 게임 시간
const BOMB_PENALTY = 1; // 폭탄 버튼 점수 패널티
const SPECIAL_BLOCK_POINTS = 3;

// 화면 크기에 따라 그리드 크기 조정
const windowWidth = Dimensions.get('window').width;
const MAX_GRID_WIDTH = 700; // 최대 그리드 크기
const gridWidth = Math.min(windowWidth * 0.8, MAX_GRID_WIDTH); // 화면 너비의 80% 혹은 최대 크기 중 작은 값
const cellSize = gridWidth / GRID_SIZE; // 각 격자 칸의 크기
const gaugeContainerWidth = windowWidth * 0.8; // 게이지 컨테이너 너비

const MoleGame = () => {
    const [activeMole, setActiveMole] = useState(null);
    const [activeBombs, setActiveBombs] = useState([]);
    const [activeSpecialBlock, setActiveSpecialBlock] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [gameActive, setGameActive] = useState(true);

    const timerLeft = useRef(new Animated.Value(GAME_DURATION)).current;
    const gifImageUri = 'https://media1.giphy.com/media/l3vR1tookIhM8nZJu/giphy.gif?cid=ecf05e472i45sfi0af5g4ga6cnv3rgtke2gfv21bb9nb1bqq&ep=v1_gifs_search&rid=giphy.gif&ct=g';

    useEffect(() => {
        Animated.timing(timerLeft, {
            toValue: 0, duration: GAME_DURATION, useNativeDriver: false
        }).start();
    }, []);

    const timeGaugeWidth = timerLeft.interpolate({
        inputRange: [0, GAME_DURATION], outputRange: [0, windowWidth * 0.8], extrapolate: 'clamp'
    });

    const gifPosition = timerLeft.interpolate({
        inputRange: [0, GAME_DURATION], outputRange: [-50, gaugeContainerWidth - 50], extrapolate: 'clamp'
    });

    const moleImageUri = 'https://i.namu.wiki/i/aJtwJmF0Ece9P0cM6dEahMsHi76985s26uZY4fAY-ROVpyGH2eGsAVR09PfNZeygyToACJJl97M-_wYr5bzNyVivyPcuirmUJuguUEJJfG0el3DGDSxlxWAoLkCSR9-P6ArWIeb1RwWl2Ni_D875CQ.webp';
    const bombImageUri = 'https://cdn.011st.com/11dims/resize/600x600/quality/75/11src/product/5321793482/B.jpg?499000000';
    const specialBlockImageUri = 'https://static.wikia.nocookie.net/pokemon/images/1/13/%EB%8B%A5%ED%8A%B8%EB%A6%AC%EC%98%A4_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20170405005841&path-prefix=ko';

    useEffect(() => {
        if (!gameActive) return;

        const updateMole = () => {
            const nextMole = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
            setActiveMole(nextMole);
            setTimeout(updateMole, MOLE_APPEAR_DURATION);
        };

        const updateBombs = () => {
            const nextBombs = new Array(3).fill(null).map(() => Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE)));
            setActiveBombs(nextBombs);
            setTimeout(updateBombs, BOMB_APPEAR_DURATION);
        };

        const updateSpecialBlock = () => {
            const nextSpecialBlock = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
            setActiveSpecialBlock(nextSpecialBlock);
            setTimeout(updateSpecialBlock, SPECIAL_BLOCK_APPEAR_DURATION);
        };

        // 초기 업데이트 시작
        updateMole();
        updateBombs();
        updateSpecialBlock();

        return () => {
            // clearTimeout을 사용해 타이머를 제거할 수 있지만,
            // 상태 업데이트 함수가 호출되는 것을 막을 방법은 없습니다.
            // 따라서 게임 활성 상태를 확인하는 로직이 중요합니다.
        };
    }, [gameActive]);


    useEffect(() => {
        if (!gameActive) {
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

    const restartGame = () => {
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setGameActive(true);
    };

    return (<View style={styles.container}>
        <View style={styles.timeGaugeContainer}>
            <Animated.View style={[styles.timeGauge, {width: timeGaugeWidth}]}/>
        </View>
        <Animated.Image
            source={{uri: gifImageUri}}
            style={[styles.gifImage, {left: gifPosition}]}
        />

        <Text style={styles.timerText}>남은 시간: {Math.round(timeLeft / 1000)}초</Text>
        <Text style={styles.scoreText}>점수: {score}</Text>

        <View style={[styles.grid, {width: gridWidth, height: gridWidth}]}>
            {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => (<TouchableOpacity
                key={index}
                style={[styles.moleHole, {width: cellSize, height: cellSize}]}
                onPress={() => handlePress(index)}
            >
                {activeMole === index && gameActive && (<Image source={{uri: moleImageUri}} style={styles.moleImage}/>)}
                {activeBombs.includes(index) && gameActive && (
                    <Image source={{uri: bombImageUri}} style={styles.moleImage}/>)}
                {activeSpecialBlock === index && gameActive && (
                    <Image source={{uri: specialBlockImageUri}} style={styles.moleImage}/>)}
            </TouchableOpacity>))}
        </View>
        {!gameActive && (<Button title="게임 재시작" onPress={restartGame}/>)}
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
        flexDirection: 'row', flexWrap: 'wrap'
    }, moleHole: {
        borderWidth: 1, borderColor: 'black'
    }, moleImage: {
        width: '100%', height: '100%'
    }, timerText: {
        fontSize: 20, marginBottom: 10
    }, gifImage: {
        width: 50, height: 50, position: 'absolute', top: 75
    }
});

export default MoleGame;
