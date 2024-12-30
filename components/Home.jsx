import React, { useEffect, useState, createContext, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import axios from 'axios';

// Context for managing item click count
const ClickCountContext = createContext();

const HomeScreen = ({ route }) => {
  const { username } = route.params;
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { clickCount, incrementClickCount, decrementClickCount } = useContext(ClickCountContext);

  useEffect(() => {
    // Fetch data from a transportation-related API
    axios
      .get('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/bus?format=json')
      .then((response) => {
        const updatedItems = response.data.Results.map((item) => ({
          id: item.MakeId,
          title: item.MakeName,
          description: `Vehicle Type: Bus`,
          price: `$${(Math.random() * 100).toFixed(2)}`,
          roomTime: `${Math.floor(Math.random() * 24)} hours`,
          clicked: false,
        }));
        setItems(updatedItems);
        setFilteredItems(updatedItems);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filteredData = items.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filteredData);
  }, [searchQuery, items]);

  const handleItemClick = (itemId) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          if (item.clicked) {
            decrementClickCount();
            return { ...item, clicked: false };
          } else {
            incrementClickCount();
            return { ...item, clicked: true };
          }
        }
        return item;
      })
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Fetching transportation data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hi, {username}!</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search your vehicles"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleItemClick(item.id)}
            style={styles.cardWrapper}
          >
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody}>{item.description}</Text>
              <Text style={styles.cardBody}>Arrival Time: {item.roomTime}</Text>
              <Text style={[styles.cardBody, styles.price]}>{item.price}</Text>
              <Text style={styles.statusTag}>
                {item.clicked ? '✔ selected' : 'Not selected'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.floatingButton}>
        <Text style={styles.floatingButtonText}>{clickCount} Clicks</Text>
      </TouchableOpacity>
    </View>
  );
};

const App = ({ route }) => {
  const [clickCount, setClickCount] = useState(0);
  const { username } = route.params;

  const incrementClickCount = () => {
    setClickCount((prev) => prev + 1);
  };

  const decrementClickCount = () => {
    setClickCount((prev) => prev - 1);
  };

  return (
    <ClickCountContext.Provider value={{ clickCount, incrementClickCount, decrementClickCount }}>
      <HomeScreen route={{ params: { username } }} />
    </ClickCountContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9FF',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    backgroundColor: '#003366',
    paddingVertical: 12,
    textAlign: 'center',
    color: 'white',
    borderRadius: 8,
  },
  searchInput: {
    height: 45,
    borderColor: '#B0B0B0',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  cardWrapper: {
    marginVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  cardBody: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
  },
  price: {
    color: 'red',
    fontWeight: 'bold',
  },
  statusTag: {
    fontSize: 16,
    fontWeight: '600',
    color: 'green',
    marginTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F9FF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007BFF',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#003366',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default App;
