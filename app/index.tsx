// App.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUri: string;
}

export default function App() {
  const MAX_PRODUCTS = 5;

  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  const hasReachedLimit = products.length >= MAX_PRODUCTS;

  // pick image from gallery
  const pickImage = async () => {
    // Request permission
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); // using expo-image-picker npm package
      if (status !== 'granted') {
        Alert.alert('Sorry', 'We need camera roll permissions to make this work!');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // set image state to selected image uri
    }
  };

  const addProduct = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter product name');
      return;
    }

    if (!price.trim() || isNaN(Number(price))) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    if (!image) {
      Alert.alert('Error', 'Please select a product photo');
      return;
    }

    if (hasReachedLimit) {
      Alert.alert('Limit Reached', `You can only add up to ${MAX_PRODUCTS} products`);
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name: name.trim(),
      price: Number(price),
      imageUri: image,
    };

    setProducts(prev => [...prev, newProduct]); // update products list

    // Reset form
    setName('');
    setPrice('');
    setImage('');

    // Show success feedback
    if (products.length + 1 === MAX_PRODUCTS) {
      setTimeout(() => {
        Alert.alert(
          'Congratulations!',
          `You've added ${MAX_PRODUCTS} products!\nYou've reached the maximum limit.`
        );
      }, 500);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.title}>Product Uploader</Text>
      <Text style={styles.counter}>
        {products.length} / {MAX_PRODUCTS} products added
      </Text>

      {
        hasReachedLimit && (
          <View style={styles.limitBanner}>
            <Text style={styles.limitText}>Maximum products reached! (5/5)</Text>
          </View>
        )
      }

      {!hasReachedLimit && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={name}
            onChangeText={setName}
            maxLength={40}
          />

          <TextInput
            style={styles.input}
            placeholder="Price (₦)"
            value={price}
            onChangeText={text => setPrice(text.replace(/[^0-9.]/g, ''))}
            keyboardType="numeric"
            maxLength={12}
          />

          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <Text style={styles.imagePickerText}>Select Product Photo</Text>
            )}
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <Button
              title="Add Product"
              onPress={addProduct}
              disabled={hasReachedLimit}
              color="#6c5ce7"
            />
          </View>
        </View>
      )}

      <ScrollView style={styles.productsList}>
        {products.map(product => (
          <View key={product.id} style={styles.productCard}>
            <Image
              source={{ uri: product.imageUri }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>₦{product.price.toLocaleString()}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2d3436',
  },
  counter: {
    textAlign: 'center',
    fontSize: 16,
    color: '#636e72',
    marginBottom: 16,
  },
  limitBanner: {
    backgroundColor: '#ff7675',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  limitText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  imagePicker: {
    height: 160,
    borderWidth: 2,
    borderColor: '#6c5ce7',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f0f4ff',
    overflow: 'hidden',
  },
  imagePickerText: {
    color: '#6c5ce7',
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    marginTop: 8,
  },
  productsList: {
    flex: 1,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    color: '#00b894',
    fontWeight: 'bold',
  },
});