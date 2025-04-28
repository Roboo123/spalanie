import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function App() {
  const [dystans, ustawDystans] = useState('');
  const [paliwo, ustawPaliwo] = useState('');
  const [wynik, ustawWynik] = useState(null);

  const obliczISave = async () => {
    const dystansLiczba = parseFloat(dystans);
    const paliwoLiczba = parseFloat(paliwo);

    if (!dystansLiczba || !paliwoLiczba) {
      Alert.alert('Błąd', 'Wpisz poprawne liczby.');
      return;
    }

    const spalanie100km = (paliwoLiczba / dystansLiczba) * 100;
    const spalanieZaokraglone = spalanie100km.toFixed(2);

    ustawWynik(spalanieZaokraglone);

    try {
      await firestore().collection('spalanie').add({
        dystans: dystansLiczba,
        zuzycie: paliwoLiczba,
        zuzycie_100km: parseFloat(spalanieZaokraglone)
      });

      Alert.alert('Sukces', 'Dane zapisane!');
      ustawDystans('');
      ustawPaliwo('');
    } catch (blad) {
      console.error(blad);
      Alert.alert('Błąd', 'Nie udało się zapisać danych.');
    }
  };

  return (
    <View style={style.ekran}>
      <Text style={style.tytul}>Kalkulator spalania</Text>

      <TextInput
        style={style.pole}
        placeholder="Dystans (km)"
        keyboardType="numeric"
        value={dystans}
        onChangeText={ustawDystans}
      />

      <TextInput
        style={style.pole}
        placeholder="Zużycie paliwa (litry)"
        keyboardType="numeric"
        value={paliwo}
        onChangeText={ustawPaliwo}
      />

      <Button title="Oblicz i Zapisz" onPress={obliczISave} />

      {wynik && (
        <Text style={style.wynik}>Średnie spalanie: {wynik} l/100km</Text>
      )}
    </View>
  );
}

const style = StyleSheet.create({
  ekran: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  tytul: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  pole: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  wynik: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
    color: 'green',
  },
});
