import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import api from '../../services/api';

export default function MyOrdersScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/myorders');
      setOrders(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.status}>Status: {item.status}</Text>
            <Text>Total: Rs. {item.totalAmount}</Text>
            <Text>Pickup: {item.pickupTime}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { padding: 15, marginVertical: 8, backgroundColor: '#eee', borderRadius: 8 },
  status: { fontSize: 16, fontWeight: 'bold' }
});
