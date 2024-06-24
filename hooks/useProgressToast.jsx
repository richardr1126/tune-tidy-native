import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Portal } from '~/components/primitives/portal';
import * as ToastPrimitive from '~/components/primitives/toast';
import { Progress } from '~/components/ui/progress';

const useProgressToast = (progress) => {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (progress >= 100) {
      hideToast();
    }
  }, [progress]);

  const showToast = useCallback(() => {
    setOpen(true);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, scale]);

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 50,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.5,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setOpen(false);
    });
  }, [opacity, translateY, scale]);

  const Toast = () => (
    open && (
      <Portal name='toast-example'>
        <Animated.View
          style={{
            bottom: insets.bottom + 50,
            opacity: opacity,
            transform: [{ translateY }, { scale }],
            position: 'absolute',
            width: '100%',
            paddingHorizontal: 8,
          }}
        >
          <ToastPrimitive.Root
            type='foreground'
            open={open}
            onOpenChange={setOpen}
            className='opacity-95 bg-popover border border-border flex-row justify-between items-center p-3 rounded-lg'
          >
            <View className='gap-2 flex-1'>
              <Progress value={progress} className='web:w-[60%]' />
              <ToastPrimitive.Description className='text-foreground'>
                Don't close the app while saving.
              </ToastPrimitive.Description>
            </View>
          </ToastPrimitive.Root>
        </Animated.View>
      </Portal>
    )
  );

  return {
    showToast,
    hideToast,
    Toast,
  };
};

export default useProgressToast;
