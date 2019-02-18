# wix-react-native-navigation-drawer

react-native-navigation does not offer a in-build solution for displaying a drawer in iOS. Their current side-menu has limited functionality. This is a pure JS solution for a drawer using showModal under the hood.

## Usage

Use wix-react-native-navigation-drawer instead of react-native-navigation.

```js

// Use this ->
import { Navigation, RNNDrawer } from "wix-react-native-navigation-drawer";

// Instead of this ->
import { Navigation } from "react-native-navigation";

```

You can then use a drawer by calling a custom method.

````js
  Navigation.showDrawer({
    component: {
      name: "CustomSideMenu",
      passProps: {
        direction: "left",
        animationOpeningTime: 300,
      },
    }
  })
````
