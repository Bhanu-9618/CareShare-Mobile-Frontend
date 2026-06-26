import React from 'react';
import AppNavigator from './src/navigations/AppNavigator';
import { AppProvider } from './src/context/AppContext';

function App(): React.JSX.Element {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}

export default App;