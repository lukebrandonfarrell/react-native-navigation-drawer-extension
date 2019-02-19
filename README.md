# react-native-navigation-drawer-extension

[React-native-navigation](https://wix.github.io/react-native-navigation/#/) does not offer an in-built solution for displaying a drawer on iOS. Their current side-menu has limited functionality on both iOS and Android. This is a drawer solution using showOverlay under the hood to display a drawer on iOS and Android.

<img align="left" src="https://raw.githubusercontent.com/LukeBrandonFarrell/open-source-images/master/react-native-navigation-drawer-extension/left-drawer.gif" width="48%" />
<img src="https://raw.githubusercontent.com/LukeBrandonFarrell/open-source-images/master/react-native-navigation-drawer-extension/bottom-drawer.gif" width="48%" />

## Install

Install via npm:
```sh
 npm install react-native-navigation-drawer-extension --save
```

## Usage

You need to register your drawer component with RNN. To do this use the register method and wrap your component in the RNNDrawer HOC. You also need to register the custom drawer methods.

```js
   import { Navigation } from "react-native-navigation";
   import { registerDrawerMethods, RNNDrawer } from "react-native-navigation-drawer-extension";

  // register our drawer methods with RNN
  registerDrawerMethods();
  // register our drawer component with RNN
  Navigation.registerComponent("CustomDrawer", () => RNNDrawer(CustomDrawer));
  
```

You can then use a drawer by calling a custom method.

````js
  // Show drawer
  Navigation.showDrawer({
    component: {
      name: "CustomDrawer",
      passProps: {
        animationOpenTime: 300,
        animationCloseTime: 300,
        direction: "left",
        dismissWhenTouchOutside: true,
        fadeOpacity: 0.6,
        drawerScreenWidth: 0.8,
        drawerScreenHeight: 1,
        style: { // Styles the drawer, supports 
          backgroundColor: "red",
        }
      },
    }
  });

  // Dismiss drawer
  Navigation.dismissDrawer(this.props.componentId);
````

## Props

| Prop                | Type          | Optional  | Default | Description                                                                             |
| ------------------- | ------------- | --------- | ------- | --------------------------------------------------------------------------------------- |
| animationOpenTime   | float         | Yes       | 300     | Time in milliseconds to execute the drawer opening animation.                           |
| animationCloseTime  | float         | Yes       | 300     | Time in milliseconds to execute the drawer closing animation.                           |
| direction           | string        | Yes       | left    | Direction to open the collage, one of: ["left", "right", "top", "bottom"].              |
| dismissWhenTouchOutside | bool      | Yes       | true    | Should the drawer be dismissed when a click is registered outside?                      |
| fadeOpacity         | number        | Yes       | 0.6     | Opacity of the screen outside the drawer.                                               |
| drawerScreenWidth   | number        | Yes       | 0.8     | 0 - 1, width of drawer in relation to the screen.                                       |
| drawerScreenHeight  | number        | Yes       | 1       | 0 - 1, height of drawer in relation to the screen.                                      |                              

## Issues

When using `Navigation.dismissDrawer` animation will not be triggered, the drawer will be hidden instantly.
Resolving [3030](https://github.com/wix/react-native-navigation/issues/3030) should allow us to fix this.
