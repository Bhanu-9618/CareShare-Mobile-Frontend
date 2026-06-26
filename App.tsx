import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigations/AppNavigator';
import { AppProvider } from './src/context/AppContext';

function App(): React.JSX.Element {
  return (
    <AppProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}

export default App;