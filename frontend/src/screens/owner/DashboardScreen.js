import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function DashboardScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const focus = navigation.addListener('focus', () => {
      fetchOrders();
    });
    return focus;
  }, [navigation]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/all');
      setOrders(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchOrders();
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
            <Text>Total: ${item.totalAmount}</Text>
            <Text>Status: {item.status}</Text>
            <View style={styles.actions}>
              <Button title="Prep" onPress={() => updateStatus(item._id, 'preparing')} />
              <Button title="Ready" onPress={() => updateStatus(item._id, 'ready')} />
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <Button title="Manage Food" onPress={() => navigation.navigate('ManageFood')} />
        <Button title="Logout" onPress={logout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { padding: 15, marginVertical: 8, backgroundColor: '#eee', borderRadius: 8 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  footer: { padding: 10, borderTopWidth: 1 }
});
