import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import api from '../../services/api';

export default function ManageFoodScreen({ navigation }) {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const focus = navigation.addListener('focus', () => {
      fetchFoods();
    });
    return focus;
  }, [navigation]);

  const fetchFoods = async () => {
    try {
      const res = await api.get('/foods');
      setFoods(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteFood = async (id) => {
    try {
      await api.delete(`/foods/${id}`);
      fetchFoods();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Add New Food" onPress={() => navigation.navigate('AddFood')} />
      <FlatList
        data={foods}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Rs. {item.price}</Text>
            <Button title="Delete" onPress={() => deleteFood(item._id)} color="red" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { padding: 15, marginVertical: 8, backgroundColor: '#eee', borderRadius: 8 },
  name: { fontSize: 18, fontWeight: 'bold' }
});
