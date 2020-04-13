/**
 * @author Luke Brandon Farrell
 * @title SideMenuView.js
 * @description A swipeable view to open a drawer.
 */

/* NPM - Node Package Manage */
import * as React from 'react';
import {
  View,
  PanResponder,
  Dimensions,
  PanResponderCallbacks,
  PanResponderInstance,
  GestureResponderEvent,
  PanResponderGestureState,
  StyleProp,
  ViewStyle,
} from 'react-native';
/* Utils - Project Utilities */
import { listen, dispatch } from './events';

const screenHeight: number = Dimensions.get('screen').height;

type SwipeFunctionType = () => void;

interface IProps {
  swipeSensitivity?: number;
  left?: SwipeFunctionType;
  right?: SwipeFunctionType;
  sideMargin?: number;
  sideMarginLeft?: number;
  sideMarginRight?: number;
  style?: StyleProp<ViewStyle>;
}

class SideMenuView extends React.Component<IProps, {}> {
  private isOpened: boolean;
  private _panResponderMethods: PanResponderCallbacks;
  private _leftPanResponder: PanResponderInstance;
  private _rightPanResponder: PanResponderInstance;
  private unsubscribeDrawerClosed: any;

  static defaultProps = {
    sideMargin: 15,
    swipeSensitivity: 0.2,
  };

  /**
   * [ Built-in React method. ]
   *
   * Setup the component. Executes when the component is created
   *
   * @param {object} props
   */
  constructor(props: IProps) {
    super(props);

    this.isOpened = false;

    const { swipeSensitivity, left, right } = props;

    this._panResponderMethods = {
      // Ask to be the responder:
      onStartShouldSetPanResponder: (
        _evt: GestureResponderEvent,
        _gestureState: PanResponderGestureState,
      ) => true,
      onStartShouldSetPanResponderCapture: (
        _evt: GestureResponderEvent,
        _gestureState: PanResponderGestureState,
      ) => true,
      onMoveShouldSetPanResponder: (
        _evt: GestureResponderEvent,
        _gestureState: PanResponderGestureState,
      ) => true,
      onMoveShouldSetPanResponderCapture: (
        _evt: GestureResponderEvent,
        _gestureState: PanResponderGestureState,
      ) => true,
      onPanResponderGrant: (
        _evt: GestureResponderEvent,
        _gestureState: PanResponderGestureState,
      ) => {
        dispatch('SWIPE_START');
      },
      onPanResponderRelease: (
        _evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        const { vx } = gestureState;

        // Emit this event when the gesture ends
        dispatch('SWIPE_END', vx > 0 ? 'right' : 'left');
      },
      onPanResponderTerminationRequest: (
        _evt: GestureResponderEvent,
        _gestureState: PanResponderGestureState,
      ) => false,
      onShouldBlockNativeResponder: (
        _evt: GestureResponderEvent,
        _gestureState: PanResponderGestureState,
      ) => false,
    };

    // LEFT PAN RESPONDER
    this._leftPanResponder = PanResponder.create({
      ...this._panResponderMethods,
      onPanResponderMove: (
        _evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        const { moveX, vx } = gestureState;

        // Emit this event on movement
        dispatch('SWIPE_MOVE', { value: moveX, direction: 'left' });

        // Left Swipe
        if (typeof swipeSensitivity !== 'undefined') {
          if (vx > swipeSensitivity && !this.isOpened && left) {
            this.isOpened = true;
            left();
          }
        }
      },
    });

    // RIGHT PAN RESPONDER
    this._rightPanResponder = PanResponder.create({
      ...this._panResponderMethods,
      onPanResponderMove: (
        _evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        const { moveX, vx } = gestureState;

        // Emit this event on movement
        dispatch('SWIPE_MOVE', { value: moveX, direction: 'right' });

        // Right Swipe
        if (typeof swipeSensitivity !== 'undefined') {
          if (vx > -swipeSensitivity && !this.isOpened && right) {
            this.isOpened = true;
            right();
          }
        }
      },
    });

    this.registerListeners = this.registerListeners.bind(this);
    this.removeListeners = this.removeListeners.bind(this);
  }

  /**
   * [ Built-in React method. ]
   *
   * Executed when the component is mounted to the screen
   */
  componentDidMount() {
    this.registerListeners();
  }

  /**
   * Registers all the listenrs for this component
   */
  registerListeners() {
    // Event fires when drawer is closed
    this.unsubscribeDrawerClosed = listen('DRAWER_CLOSED', () => {
      this.isOpened = false;
    });
  }

  /**
   * Removes all the listenrs from this component
   */
  removeListeners() {
    this.unsubscribeDrawerClosed();
  }

  /**
   * [ Built-in React method. ]
   *
   * Allows us to render JSX to the screen
   */
  render() {
    /** Props */
    const {
      children,
      left,
      right,
      sideMargin,
      sideMarginLeft,
      sideMarginRight,
      ...props
    } = this.props;

    return (
      <View {...props}>
        {children}

        {left ? (
          <View
            style={{
              left: 0,
              position: 'absolute',
              width: sideMargin || sideMarginLeft,
              height: screenHeight,
              zIndex: 9999,
            }}
            {...this._leftPanResponder.panHandlers}
          />
        ) : null}

        {right ? (
          <View
            style={{
              position: 'absolute',
              right: 0,
              width: sideMargin || sideMarginRight,
              height: screenHeight,
              zIndex: 9999,
            }}
            {...this._rightPanResponder.panHandlers}
          />
        ) : null}
      </View>
    );
  }
}

export default SideMenuView;
