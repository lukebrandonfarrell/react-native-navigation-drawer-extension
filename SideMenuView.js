/**
 * @author Luke Brandon Farrell
 * @title SideMenuView.js
 * @description A swipeable view to open a drawer.
 */

// /* NPM - Node Package Manage */
import React, { Component } from 'react';
import { View, PanResponder } from 'react-native';
import { state, Beep } from 'react-beep';
import PropTypes from 'prop-types';

class SideMenuView extends Beep(['open']) {
  /**
   * [ Built-in React method. ]
   *
   * Setup the component. Executes when the component is created
   *
   * @param {object} props
   */
  constructor(props) {
    super(props);

    const { sideMargin, swipeSensitivity } = props;

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderMove: (evt, gestureState) => {
        const { moveX, moveY, vx, vy } = gestureState;

        // Left, Right
        if(Math.abs(vx) > swipeSensitivity) {
          if (moveX < (sideMargin || sideMarginLeft) && !state.open) {
            if(this.props.left) this.props.left();
          } else if (moveX < -(sideMargin || sideMarginRight) && !state.open) {
            if(this.props.right) this.props.right();
          }
        }

        // Top, Down
        if(Math.abs(vy) > swipeSensitivity) {
          if (moveY < (sideMargin || sideMarginBottom) && !state.open) {
            if(this.props.bottom) this.props.bottom();
          } else if (moveY < -(sideMargin || sideMarginTop) && !state.open) {
            if(this.props.top) this.props.top();
          }
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    });
  }

  /**
   * [ Built-in React method. ]
   *
   * Allows us to render JSX to the screen
   */
  render(){
    const { children, ...props } = this.props;

    return (
      <View {...this._panResponder.panHandlers} {...props}>
        {children}
      </View>
    )
  }
}

SideMenuView.defaultProps = {
  sideMargin: 75,
  swipeSensitivity: 0.6
};

SideMenuView.propTypes = {
  left: PropTypes.func,
  right: PropTypes.func,
  bottom: PropTypes.func,
  top: PropTypes.func,
  swipeSensitivity: PropTypes.number,
  sideMargin: PropTypes.number,
  sideMarginLeft: PropTypes.number,
  sideMarginRight: PropTypes.number,
  sideMarginTop: PropTypes.number,
  sideMarginBottom: PropTypes.number,
}

export default SideMenuView;