import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from './theme';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
            <Pressable key={route.key} onPress={onPress} style={styles.tab} accessibilityRole="button">
            <View style={[styles.triangleWrap, { pointerEvents: 'none' }]}>
              <View style={[styles.triangle, isFocused ? styles.triangleActive : styles.triangleInactive]} />
            </View>
            <Text style={[styles.label, isFocused ? styles.labelActive : null]}>{String(label)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(6,17,31,0.98)',
    borderTopColor: 'rgba(148,163,184,0.08)',
    borderTopWidth: 1,
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  triangleWrap: {
    height: 12,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  triangleActive: {
    borderBottomColor: colors.primary,
  },
  triangleInactive: {
    borderBottomColor: 'transparent',
  },
  label: {
    color: colors.textSoft,
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
});
