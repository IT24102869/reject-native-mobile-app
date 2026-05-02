import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function MenuScreen({ navigation }) {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const focus = navigation.addListener('focus', () => {
      fetchFoods();
    });
    return focus;
  }, [navigation]);

  const fetchFoods = async () => {
    try {
      const res = await api.get('/foods');
      setFoods(res.data.filter(f => f.available));
    } catch (e) {
      console.log(e);
    }
  };

  const addToCart = (food) => {
    setCart([...cart, { food, quantity: 1 }]);
    Alert.alert('Added', `${food.name} added to cart`);
  };

  const checkout = async () => {
    if (cart.length === 0) return Alert.alert('Cart empty');
    try {
      const items = cart.map(c => ({ food: c.food._id, quantity: c.quantity }));
      const totalAmount = cart.reduce((acc, c) => acc + (c.food.price * c.quantity), 0);
      await api.post('/orders', { items, totalAmount, pickupTime: '12:00 PM' });
      Alert.alert('Success', 'Order placed');
      setCart([]);
      navigation.navigate('MyOrders');
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Failed to place order');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={foods}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Rs. {item.price}</Text>
            <Button title="Add" onPress={() => addToCart(item)} />
          </View>
        )}
      />
      <View style={styles.footer}>
        <Text>Cart: {cart.length} items</Text>
        <Button title="Checkout" onPress={checkout} />
        <Button title="My Orders" onPress={() => navigation.navigate('MyOrders')} />
        <Button title="Logout" onPress={logout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { padding: 15, marginVertical: 8, backgroundColor: '#eee', borderRadius: 8 },
  name: { fontSize: 18, fontWeight: 'bold' },
  footer: { padding: 10, borderTopWidth: 1 }
});
