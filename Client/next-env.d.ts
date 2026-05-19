/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          'ios-src'?: string;
          ar?: boolean;
          'ar-modes'?: string;
          'ar-placement'?: string;
          'camera-controls'?: boolean;
          'touch-action'?: string;
          'auto-rotate'?: boolean;
          'shadow-intensity'?: string;
          'shadow-softness'?: string;
          'environment-image'?: string;
          exposure?: string;
          alt?: string;
        },
        HTMLElement
      >;
    }
  }
}