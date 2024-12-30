import React, { useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  StatusBar,
  Dimensions,
} from 'react-native';

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const [buttonScale] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const validateForm = () => {
    let valid = true;
    let errorMessages = {
      username: '',
      password: '',
    };

    // Username validation
    if (username.trim() === '') {
      errorMessages.username = 'Username is required';
      valid = false;
    }

    // Password validation
    if (password.trim() === '') {
      errorMessages.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      errorMessages.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(errorMessages);
    return valid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      navigation.navigate('Home', { username: username }); // Pass username to Home screen
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />

        <Image
          source={{
            uri: 'https://media.licdn.com/dms/image/D4E12AQEfNWNSinp_Gg/article-cover_image-shrink_720_1280/0/1696979503695?e=2147483647&v=beta&t=Ec24EUfTGPXXtZtFQ1dtZj5WJcYdeihK6hV3zP3yoL0',
          }}
          style={styles.backgroundImage}
        />

        <View style={styles.overlay}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1586768011039-875e8293d404?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            }}
            style={styles.overlayImage}
            blurRadius={3}
          />
        </View>

        <Animated.View
          style={[
            styles.contentContainer,
            { opacity: fadeAnim },
          ]}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>SWIFT</Text>
            <Text style={styles.headerSubtitle}>TRANSPORT</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>Please login to your account</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={[styles.input, errors.username ? styles.errorInput : null]}
                placeholder="Enter your username"
                placeholderTextColor="#666"
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
              {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, errors.password ? styles.errorInput : null]}
                placeholder="Enter your password"
                placeholderTextColor="#666"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            <TouchableOpacity
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleSubmit}
              activeOpacity={0.9}
            >
              <Animated.View
                style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}
              >
                <Text style={styles.buttonText}>Log In</Text>
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerLinkContainer}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerLinkText}>
                New here? <Text style={styles.registerLinkHighlight}>Register</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '45%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  overlayImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    opacity: 0.4,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 8,
  },
  headerSubtitle: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 4,
    marginTop: -5,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingTop: 20,
    marginTop: 'auto',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cardHeader: {
    marginBottom: 25,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 55,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  errorInput: {
    borderColor: '#ff4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
    marginLeft: 4,
  },
  buttonContainer: {
    height: 55,
    backgroundColor: 'darkblue',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1e40af',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerLinkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: 15,
    color: '#1a73e8',
  },
  registerLinkHighlight: {
    fontWeight: 'bold',

  },
});

export default LoginScreen;
