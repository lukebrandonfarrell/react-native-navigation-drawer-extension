/**
 * @author Luke Brandon Farrell
 * @title SideMenuView.js
 * @description A swipeable view to open a drawer.
 */

// /* NPM - Node Package Manage */
import React, { Component } from 'react';
import { View, PanResponder,Dimensions } from 'react-native';
import { on, emit } from 'jetemit';
import PropTypes from 'prop-types';

const screenHeight = Dimensions.get("screen").height;

class SideMenuView extends Component {
  /**
   * [ Built-in React method. ]
   *
   * Setup the component. Executes when the component is created
   *
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.isOpened = false;

    const { swipeSensitivity, left, right } = props;

    this._panResponderMethods = {
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        emit('SWIPE_START');
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { vx } = gestureState;

        // Emit this event when the gesture ends
        emit('SWIPE_END', (vx > 0) ? "right" : "left");
      },
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onShouldBlockNativeResponder: (evt, gestureState) => false,
    };

    // LEFT PAN RESPONDER
    this._leftPanResponder = PanResponder.create({
      ...this._panResponderMethods,
      onPanResponderMove: (evt, gestureState) => {
        const { moveX, vx } = gestureState;

        // Emit this event on movement
        emit('SWIPE_MOVE', { value: moveX, direction: "left" });

        // Left Swipe
        if(vx > swipeSensitivity && !this.isOpened && left) {
          this.isOpened = true; left();
        }
      },
    });

    // RIGHT PAN RESPONDER
    this._rightPanResponder = PanResponder.create({
      ...this._panResponderMethods,
      onPanResponderMove: (evt, gestureState) => {
        const { moveX, vx } = gestureState;

        // Emit this event on movement
        emit('SWIPE_MOVE', { value: moveX, direction: "right" });

        // Right Swipe
        if(vx > -swipeSensitivity && !this.isOpened && right) {
          this.isOpened = true; right();
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
    this.unsubscribeDrawerClosed = on('DRAWER_CLOSED', () => {
      this.isOpened = false;
    });
  }

  /**
   * Removes all the listenrs from this component
   */
  removeListeners(){
    this.unsubscribeDrawerClosed();
  }

  /**
   * [ Built-in React method. ]
   *
   * Allows us to render JSX to the screen
   */
  render(){
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

          {
            left ? (
                <View style={{
                  left: 0,
                  position: "absolute",
                  width: sideMargin || sideMarginLeft,
                  height: screenHeight
                }} {...this._leftPanResponder.panHandlers} />
            ) : null
          }

          {
            right ? (
                <View style={{
                  position: "absolute",
                  right: 0,
                  width: sideMargin || sideMarginRight,
                  height: screenHeight
                }} {...this._rightPanResponder.panHandlers} />
            ) : null
          }
        </View>
    )
  }
};

SideMenuView.defaultProps = {
  sideMargin: 15,
  swipeSensitivity: 0.2
}

SideMenuView.propTypes = {
  left: PropTypes.func,
  right: PropTypes.func,
  swipeSensitivity: PropTypes.number,
  sideMargin: PropTypes.number,
  sideMarginLeft: PropTypes.number,
  sideMarginRight: PropTypes.number
}

export default SideMenuView;