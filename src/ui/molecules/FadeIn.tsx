import React, { PropsWithChildren } from 'react';
import { MotiView } from 'moti';

type FadeInProps = {
  delay?: number,
};

export default function FadeIn({ children, delay = 0 }: PropsWithChildren<FadeInProps>) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300, delay }}
    >
      {children}
    </MotiView>
  );
}


