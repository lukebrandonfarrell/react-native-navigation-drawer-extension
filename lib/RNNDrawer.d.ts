/**
 * @author Luke Brandon Farrell
 * @description An animated drawer component for react-native-navigation.
 */
import * as React from 'react';
import { Layout } from 'react-native-navigation';
declare class RNNDrawer {
    static create(Component: React.ComponentType): any;
    /**
     * Shows a drawer component
     *
     * @param layout
     */
    static showDrawer(layout: Layout): void;
    /**
     * Dismiss the drawer component
     */
    static dismissDrawer(): void;
}
export default RNNDrawer;
