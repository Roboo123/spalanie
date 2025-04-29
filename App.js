import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function App() {
  const [fuelBurnt, setFuelBurnt] = useState('');
  const [distance, setDistance] = useState('');
  const [fuelPer100, setFuelPer100] = useState('');

  const calculateFuelPer100 = () => {
    if (fuelBurnt === '' || distance === '') {
      Alert.alert('Błąd', 'Uzupełnij wszystkie pola');
      return;
    }
    const fuel = parseFloat(fuelBurnt);
    const dist = parseFloat(distance);
    if (isNaN(fuel) || isNaN(dist) || dist <= 0) {
      Alert.alert('Błąd', 'Podaj poprawne wartości');
      return;
    }
    const result = (fuel / dist) * 100;
    setFuelPer100(result.toFixed(2));
    setFuelBurnt('');
    setDistance('');
    addToDatabase(result.toFixed(2));
  }

  const addToDatabase = async (fuelResult) => {
    try {
      await addDoc(collection(db, 'spalanie'), {
        zużycie: parseFloat(fuelBurnt),
        dystans: parseFloat(distance),
        zużycie_100km: fuelResult,
      });
      Alert.alert('Sukces', 'Dane zostały dodane do bazy danych');
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się dodać danych do bazy danych');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kalkulator Spalania</Text>

      <TextInput
        style={styles.input}
        placeholder="Ilość spalonego paliwa w litrach"
        value={fuelBurnt}
        onChangeText={setFuelBurnt}
        keyboardType="numeric"
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Ilość przejechanych kilometrów (km)"
        value={distance}
        onChangeText={setDistance}
        keyboardType="numeric"
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={calculateFuelPer100}>
        <Text style={styles.buttonText}>Oblicz</Text>
      </TouchableOpacity>

      {fuelPer100 !== '' && (
        <Text style={styles.result}>
          Spalanie: {fuelPer100} L/100km
        </Text>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffd700', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#8b0000', 
    textAlign: 'center', 
    textShadowColor: '#000', 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  input: {
    width: '90%',
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 20, 
    paddingHorizontal: 15,
    fontSize: 18,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#8b0000', 
    elevation: 3,
  },
  button: {
    width: '90%',
    height: 60, 
    backgroundColor: '#00bfff', 
    borderRadius: 20, 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20, 
    fontWeight: 'bold',
    textTransform: 'uppercase', 
  },
  result: {
    marginTop: 30,
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#006400', 
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
  },
});