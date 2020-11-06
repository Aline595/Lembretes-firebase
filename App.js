import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import ENV from './env';
import * as firebase from 'firebase';
import 'firebase/firestore';
//18:15 -> 19

// Iniciar o firebase
if (!firebase.apps.length)
  firebase.initializeApp(ENV);

const db = firebase.firestore();

export default function App() {
  const [lembrete, setLembrete] = useState('');
  const [lembretes, setLembretes] = useState([]);

  const capturarLembrete = (lembrete) =>{
    setLembrete(lembrete);
  }

  const removeLembrete = (chave) =>{
    Alert.alert(
      'Apagar ?', 
      'Quer mesmo apagar seu lembrete?', 
      [
        {text: 'Cancelar'},
        {text: 'Confirmar', onPress:() => db.collection('lembretes').doc(chave).delete()}
      ]
    );
    
  }

  const adicionarLembrete = () => {
    db.collection('lembretes').add({
      texto: lembrete,
      data: new Date()
    });
  }
  useEffect(() => {
    db.collection('lembretes').onSnapshot(snapshot => {
      let aux = [];
      snapshot.forEach(doc => {
        aux.push({
          data: doc.data().data,
          texto: doc.data().texto,
          chave: doc.id,
        })
        //aux.push(doc.data());
      });
      setLembretes(aux);
    });
  }, []);

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.entrada} 
        placeholder="Digite seu lembrete" 
        onChangeText={capturarLembrete}
        value={lembrete}
      />
      <View style={styles.botao}>
        <Button
          title="OK"
          onPress={adicionarLembrete}
        />
      </View>
      <FlatList 
        style={{marginTop: 8}}
        data={lembretes}
        renderItem={lembrete => (
          <TouchableOpacity onLongPress={() => removeLembrete(lembrete.item.chave)}>

          <View style={styles.itemNaLista}>
            <Text>{lembrete.item.texto}</Text>
            <Text>{lembrete.item.data.toDate().toLocaleString()}</Text>
          </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemNaLista:{
    marginBottom: 4,
    borderBottomColor: '#DDD',
    borderBottomWidth: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12
  },
  container: {
    padding: 40,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  entrada: {
    padding: 8,
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    fontSize: 14,
    textAlign: "center",
    width: '80%',
    marginBottom: 12
  },

  botao:{
    width: '80%'
  }
});
