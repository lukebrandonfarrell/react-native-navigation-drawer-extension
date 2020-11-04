import {Navigation} from 'react-native-navigation';
import {RNNDrawer} from 'react-native-navigation-drawer-extension';

import CustomDrawer from './src/components/CustomDrawer';
import AnotherPage from './src/pages/AnotherPage';
import HomePage from './src/pages/HomePage';
import Page1 from './src/pages/Page1';
import Page2 from './src/pages/Page2';

Navigation.registerComponent('HomePage', () => HomePage);
Navigation.registerComponent('CustomDrawer', () =>
  RNNDrawer.create(CustomDrawer),
);
Navigation.registerComponent('AnotherPage', () => AnotherPage);
Navigation.registerComponent('Page1', () => Page1);
Navigation.registerComponent('Page2', () => Page2);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'HomePage',
            },
          },
        ],
      },
    },
  });
});
