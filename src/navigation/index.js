import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VerificationScreen from '../screens/VerificationScreen';
import AuthSuccessScreen from '../screens/AuthSuccessScreen';
import HomeScreen from '../screens/HomeScreen';
import RecentsScreen from '../screens/RecentsScreen';
import DigitalPassportScreen from '../screens/DigitalPassportScreen';
import ScannerScreen from '../screens/ScannerScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isAuthenticated, validateUser, logout } = useContext(AuthContext);

  // Periodic auth validation check
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated()) {
        const isValid = validateUser();
        if (!isValid) {
          logout();
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, validateUser, logout]);

  return (
    <NavigationContainer
      onStateChange={async state => {
        // Check auth status on navigation state change
        if (isAuthenticated()) {
          const isValid = validateUser();
          if (!isValid) {
            logout();
          }
        }
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        {!isAuthenticated() ? (
          <>
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ animationEnabled: false }}
            />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Verification" component={VerificationScreen} />
            <Stack.Screen name="AuthSuccess" component={AuthSuccessScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Scanner" component={ScannerScreen} />
            <Stack.Screen name="Recents" component={RecentsScreen} />
            <Stack.Screen
              name="DigitalPassport"
              component={DigitalPassportScreen}
            />
            <Stack.Screen name="Verification" component={VerificationScreen} />
            <Stack.Screen name="AuthSuccess" component={AuthSuccessScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
