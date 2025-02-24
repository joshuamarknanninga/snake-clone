import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://YOUR_SERVER_IP:3001';

const CELL_SIZE = 20;
const GRID_SIZE = 20;

export default function GameScreen() {
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState({});

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on('gameState', (data) => {
      setPlayers(data);
    });

    return () => newSocket.disconnect();
  }, []);

  const changeDirection = (direction) => {
    if (socket) {
      socket.emit('changeDirection', { direction });
    }
  };

  const renderGrid = () => {
    const grid = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      const cells = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        let cellStyle = styles.cell;
        // Check if any player occupies this cell
        Object.values(players).forEach((player) => {
          if (player.x === col && player.y === row) {
            cellStyle = { ...cellStyle, backgroundColor: 'green' };
          }
          player.tail.forEach((segment) => {
            if (segment.x === col && segment.y === row) {
              cellStyle = { ...cellStyle, backgroundColor: 'lightgreen' };
            }
          });
        });
        cells.push(<View key={`${row}-${col}`} style={cellStyle} />);
      }
      grid.push(
        <View key={row} style={styles.row}>
          {cells}
        </View>
      );
    }
    return grid;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Multiplayer Snake</Text>
      <View style={styles.gridContainer}>{renderGrid()}</View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => changeDirection('UP')} style={styles.button}>
          <Text>Up</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => changeDirection('LEFT')} style={styles.button}>
            <Text>Left</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeDirection('DOWN')} style={styles.button}>
            <Text>Down</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeDirection('RIGHT')} style={styles.button}>
            <Text>Right</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 10
  },
  gridContainer: {
    width: CELL_SIZE * GRID_SIZE,
    height: CELL_SIZE * GRID_SIZE,
    backgroundColor: '#ccc'
  },
  row: {
    flexDirection: 'row'
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
    borderColor: '#999'
  },
  controls: {
    marginTop: 20,
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#ddd',
    padding: 10,
    margin: 5,
    borderRadius: 5
  }
});
