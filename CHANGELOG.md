## 3.2.0 (November 2020)
- Added orientation support
- Drawer can now be closed by swipping it
- Added example project

## 2.0.2 (October 2019)
- Fixed possuble undefined value when swipping.

## 2.0.1 (August 2019)
- Added types declaration to NPM package.json

## 2.0.0 (August 2019)

- Package has been re-written using TypeScript!
- The 'jetemit' dependancy has been removed in favour of a in-built event system (zero dependancies 🚀).
- Height / Width of drawer can now be provided as a percentage or absolute value (e.g. `"80%"` | `425`)
- The library no longer monkey patches the RNN Navigation method. Instead the drawer can be toggled using `RNNDrawer.showDrawer(options: Layout)` or `RNNDrawer.dismissDrawer(options: Layout)`.
- Fixed [#8](https://github.com/lukebrandonfarrell/react-native-navigation-drawer-extension/issues/8) with undefined listenr.
- Drawers are now created using a `create` method on `RNNDrawer`