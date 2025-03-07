import React from 'react';
import { SafeAreaView } from 'react-native';
import GameScreen from './components/GameScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GameScreen />
    </SafeAreaView>
  );
}
