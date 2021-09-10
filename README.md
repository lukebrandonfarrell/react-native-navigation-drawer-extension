<h2 align="center">
  <img src="https://user-images.githubusercontent.com/7014073/98849326-cca07f80-2431-11eb-82dd-fd2b4e52be44.png?s=300" width="325" /><br/>
  React Native Navigation Drawer Extension
</h2>

<p align="center">
  <a href="https://www.npmjs.com/package/react-native-navigation-drawer-extension" rel="nofollow">
  <img src="https://img.shields.io/npm/v/react-native-navigation-drawer-extension.svg?style=flat-square" alt="version" style="max-width:100%;" />
  </a>
  <a href="https://www.npmjs.com/package/react-native-navigation-drawer-extension" rel="nofollow">
  <img src="http://img.shields.io/npm/l/react-native-navigation-drawer-extension.svg?style=flat-square" alt="license" style="max-width:100%;" />
  </a>
  <a href="https://www.npmjs.com/package/react-native-navigation-drawer-extension" rel="nofollow">
    <img src="http://img.shields.io/npm/dt/react-native-navigation-drawer-extension.svg?style=flat-square" alt="downloads" style="max-width:100%;" />
  </a>
</p>

[React Native Navigation by Wix](https://wix.github.io/react-native-navigation/#/) does not offer an in-built solution for displaying a drawer on iOS. Their current side-menu has limited functionality on both iOS and Android. This is a drawer solution using showOverlay under the hood to display a drawer on iOS and Android.

If you are using React Native Navigation >= 3.0.0 then use version 3.x.x + of this library.

<img align="left" src="https://raw.githubusercontent.com/LukeBrandonFarrell/open-source-images/master/react-native-navigation-drawer-extension/left-drawer.gif" width="48%" />
<img src="https://raw.githubusercontent.com/LukeBrandonFarrell/open-source-images/master/react-native-navigation-drawer-extension/bottom-drawer.gif" width="48%" />

## Install

```sh
 npm install react-native-navigation-drawer-extension --save
```

or

```sh
 yarn add react-native-navigation-drawer-extension
```

## Usage

You need to register your drawer component with RNN. To do this use the register method and wrap your component in the RNNDrawer HOC.

```js
import { Navigation } from "react-native-navigation";
import { RNNDrawer } from "react-native-navigation-drawer-extension";

// register our drawer component with RNN
Navigation.registerComponent("CustomDrawer", () => RNNDrawer.create(CustomDrawer));
```

You can then use the drawer by calling a custom method. The `showDrawer` method
will take a single parameter `options` identical to `showOverlay`.

````js
import { RNNDrawer } from "react-native-navigation-drawer-extension";

RNNDrawer.showDrawer({
  component: {
    name: "CustomDrawer",
    passProps: {
      animationOpenTime: 300,
      animationCloseTime: 300,
      direction: "left",
      dismissWhenTouchOutside: true,
      fadeOpacity: 0.6,
      drawerScreenWidth: "75%" || 445, // Use relative to screen '%' or absolute
      drawerScreenHeight: "100%" || 700,
      style: { // Styles the drawer container, supports any react-native style
        backgroundColor: "red",
      },
      parentComponentId: props.componentId, // Custom prop, will be available in your custom drawer component props
    },
  }
});

RNNDrawer.dismissDrawer();
````

To navigate from the drawer you must pass the parent `componentId` and use that to navigate. e.g:

```js
// From drawer component
Navigation.push(parentComponentId, {
  component: {
    name: "CustomScreenFromDrawer",
  },
});
```

There's a complete and functional example at the `example` folder, with more thorough explanation on each method.

#### Props

The props below are used to configure the drawer and are to be used in RNN `passProps:`. Any aditional
props will be passed to your custom drawer component.

| Prop                | Type          | Optional  | Default | Description                                                                             |
| ------------------- | ------------- | --------- | ------- | --------------------------------------------------------------------------------------- |
| animationOpenTime   | float         | Yes       | 300     | Time in milliseconds to execute the drawer opening animation.                           |
| animationCloseTime  | float         | Yes       | 300     | Time in milliseconds to execute the drawer closing animation.                           |
| direction           | string        | Yes       | left    | Direction to open the collage, one of: ["left", "right", "top", "bottom"].              |
| dismissWhenTouchOutside | bool      | Yes       | true    | Should the drawer be dismissed when a click is registered outside?                      |
| fadeOpacity         | number        | Yes       | 0.6     | Opacity of the screen outside the drawer.                                               |
| drawerScreenWidth   | number        | Yes       | 0.8     | 0 - 1, width of drawer in relation to the screen.                                       |
| drawerScreenHeight  | number        | Yes       | 1       | 0 - 1, height of drawer in relation to the screen.                                      |                         
| disableDragging     | boolean       | Yes       | false   | Whether you want to disable dragging of the drawer. Useful if you have ScrollView inside the drawer (addresses #62).|                         
| disableSwiping      | boolean       | Yes       | false   | Whether you want to disable swiping gesture. Use it only in pair with disableDragging.|                         

## SideMenuView

<img src="https://raw.githubusercontent.com/LukeBrandonFarrell/open-source-images/master/react-native-navigation-drawer-extension/slide-drawer.gif" width="30%" />

The library also exposes a component which will allow you to open the drawer by either swiping the left or right gutter of the phone. This is achieved by using event listeners
to communicate with the RNNDrawer HOC component. To enable this feature wrap your screen with the `SideMenuView` component. `<SideMenuView>` is just an enhanced `<View>` all props are passed down to `<View>`.

```js
import { SideMenuView } from "react-native-navigation-drawer-extension";

<SideMenuView
  style={{ flex: 1 }}
  drawerName={'CustomDrawer'}
  direction={'right'}
  passProps={{
    animationOpenTime: 300,
    animationCloseTime: 300,
    dismissWhenTouchOutside: true,
    fadeOpacity: 0.6,
    drawerScreenWidth: '75%',
    drawerScreenHeight: '100%',
    parentComponentId: props.componentId,
    style: {
      backgroundColor: 'white', 
    },
  }}
  options={{
    layout: {
      componentBackgroundColor: 'transparent',
    }
 >
  {...}
 </SideMenuView>

```

#### Props

| Prop                | Type          | Optional  | Default | Description                                                                             |
| ------------------- | ------------- | --------- | ------- | --------------------------------------------------------------------------------------- |
| style               | StyleProp<ViewStyle> | Yes |        | The style of the drawer container.                              |
| drawerName          | string        | No        |         | The name of the drawer component.
| direction           | string        | Yes       | left    | The direction to open the drawer, one of: ["left", "right"].
| passProps           | object        | Yes       |         | The values passed to the drawer. See props in RNNDrawer above.
| options             | Options       | Yes       |         | The options to configure properties of the React Native Navigation native screen. Refer to React Native Navigation's options object.
| swipeSensitivity    | number        | Yes       | 0.2     | The sensitivity of the swipe to invoke each function.                                   |
| sideMargin          | number        | Yes       | 15      | The size of the gutter for both sides.                                                  |
| sideMarginLeft      | number        | Yes       |         | The size of the gutter for the left side.                                               |
| sideMarginRight     | number        | Yes       |         | The size of the gutter for the right side.                                              |   

## Contributors ✨
  
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
  [![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/rodriigovieira"><img src="https://avatars.githubusercontent.com/u/7014073?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rodrigo Vieira</b></sub></a><br /><a href="https://github.com/aspect-apps/react-native-navigation-drawer-extension/commits?author=rodriigovieira" title="Code">💻</a> <a href="https://github.com/aspect-apps/react-native-navigation-drawer-extension/issues?q=author%3Arodriigovieira" title="Bug reports">🐛</a> <a href="https://github.com/aspect-apps/react-native-navigation-drawer-extension/commits?author=rodriigovieira" title="Documentation">📖</a> <a href="#maintenance-rodriigovieira" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://discord.gg/QqTN6HqNTG"><img src="https://avatars.githubusercontent.com/u/18139277?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Luke Brandon Farrell</b></sub></a><br /><a href="https://github.com/aspect-apps/react-native-navigation-drawer-extension/commits?author=lukebrandonfarrell" title="Code">💻</a> <a href="https://github.com/aspect-apps/react-native-navigation-drawer-extension/issues?q=author%3Alukebrandonfarrell" title="Bug reports">🐛</a> <a href="https://github.com/aspect-apps/react-native-navigation-drawer-extension/commits?author=lukebrandonfarrell" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/CursedWizard"><img src="https://avatars.githubusercontent.com/u/67508707?v=4?s=100" width="100px;" alt=""/><br /><sub><b>CyberFuntik</b></sub></a><br /><a href="https://github.com/aspect-apps/react-native-navigation-drawer-extension/commits?author=CursedWizard" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
