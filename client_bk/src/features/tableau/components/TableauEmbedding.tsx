import React, { CSSProperties, ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import '@tableau/embedding-api';

import type { PulseLayout, Toolbar } from '@tableau/embedding-api';

interface TableauVizElement extends HTMLElement {
  src?: string;
  token?: string;
  toolbar?: Toolbar | 'hidden' | 'top' | 'bottom';
  hideTabs?: boolean;
  width?: string;
  height?: string;
  iframeStyle?: string;
  iframeAuth?: boolean;
  forceTokenSync?: boolean;
  debug?: boolean;
}

interface TableauPulseElement extends HTMLElement {
  src?: string;
  token?: string;
  layout?: PulseLayout | 'default' | 'card' | 'ban';
  width?: string;
  height?: string;
  disableExploreFilter?: boolean;
  timeDimension?: string;
  isTokenOptional?: boolean;
}

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tableau-viz': React.DetailedHTMLProps<React.HTMLAttributes<TableauVizElement>, TableauVizElement>;
      'tableau-pulse': React.DetailedHTMLProps<React.HTMLAttributes<TableauPulseElement>, TableauPulseElement>;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

const updateStringProp = (
  element: HTMLElement | null,
  attribute: string,
  value?: string,
  property: string = attribute
) => {
  if (!element) {
    return;
  }

  const target = element as HTMLElement & { [key: string]: unknown };

  if (value === undefined || value === null) {
    element.removeAttribute(attribute);
    delete target[property];
    return;
  }

  element.setAttribute(attribute, value);
  target[property] = value;
};

const updateBooleanProp = (
  element: HTMLElement | null,
  attribute: string,
  value?: boolean,
  property: string = attribute
) => {
  if (!element) {
    return;
  }

  const target = element as HTMLElement & { [key: string]: unknown };

  if (value === undefined) {
    element.removeAttribute(attribute);
    delete target[property];
    return;
  }

  if (value) {
    element.setAttribute(attribute, '');
  } else {
    element.removeAttribute(attribute);
  }

  target[property] = value;
};

const useForwardedRef = <T extends HTMLElement>(forwardedRef: ForwardedRef<T>) => {
  const innerRef = useRef<T>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current as T, []);

  return innerRef;
};

const baseStyle: CSSProperties = {
  width: '100%',
  height: '100%'
};

export interface TableauVizProps {
  src?: string;
  token?: string;
  toolbar?: Toolbar | 'hidden' | 'top' | 'bottom';
  hideTabs?: boolean;
  width?: string;
  height?: string;
  iframeStyle?: string;
  iframeAuth?: boolean;
  forceTokenSync?: boolean;
  debug?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const TableauViz = forwardRef<TableauVizElement, TableauVizProps>(
  (
    {
      src,
      token,
      toolbar = 'bottom',
      hideTabs = false,
      width = '100%',
      height = '100%',
      iframeStyle,
      iframeAuth,
      forceTokenSync,
      debug,
      className,
      style
    },
    ref
  ) => {
    const elementRef = useForwardedRef<TableauVizElement>(ref);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateStringProp(element, 'src', src);
    }, [src, elementRef]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateStringProp(element, 'token', token);
    }, [token, elementRef]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateStringProp(element, 'toolbar', toolbar);
    }, [toolbar, elementRef]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateBooleanProp(element, 'hide-tabs', hideTabs, 'hideTabs');
    }, [hideTabs, elementRef]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateStringProp(element, 'width', width);
    }, [width, elementRef]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateStringProp(element, 'height', height);
    }, [height, elementRef]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateStringProp(element, 'iframe-style', iframeStyle, 'iframeStyle');
    }, [iframeStyle, elementRef]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateBooleanProp(element, 'iframe-auth', iframeAuth, 'iframeAuth');
    }, [iframeAuth, elementRef]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateBooleanProp(element, 'force-token-sync', forceTokenSync, 'forceTokenSync');
    }, [forceTokenSync, elementRef]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateBooleanProp(element, 'debug', debug, 'debug');
    }, [debug, elementRef]);

    return (
      <tableau-viz
        ref={elementRef}
        className={className}
        style={{ ...baseStyle, ...style }}
      />
    );
  }
);

export interface TableauPulseProps {
  src?: string;
  token?: string;
  layout?: PulseLayout | 'default' | 'card' | 'ban';
  width?: string;
  height?: string;
  disableExploreFilter?: boolean;
  timeDimension?: string;
  isTokenOptional?: boolean;
  iframeStyle?: string;
  iframeAuth?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const TableauPulse = forwardRef<TableauPulseElement, TableauPulseProps>(
  (
    {
      src,
      token,
      layout = 'default',
      width = '100%',
      height = '100%',
      disableExploreFilter,
      timeDimension,
      isTokenOptional,
      iframeStyle,
      iframeAuth,
      className,
      style
    },
    ref
  ) => {
    const elementRef = useForwardedRef<TableauPulseElement>(ref);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateStringProp(element, 'src', src);
    }, [src, elementRef]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateStringProp(element, 'token', token);
    }, [token, elementRef]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateStringProp(element, 'layout', layout);
    }, [layout, elementRef]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateStringProp(element, 'width', width);
    }, [width, elementRef]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateStringProp(element, 'height', height);
    }, [height, elementRef]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateBooleanProp(element, 'disable-explore-filter', disableExploreFilter, 'disableExploreFilter');
    }, [disableExploreFilter, elementRef]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateStringProp(element, 'time-dimension', timeDimension, 'timeDimension');
    }, [timeDimension, elementRef]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateBooleanProp(element, 'token-optional', isTokenOptional, 'isTokenOptional');
    }, [isTokenOptional, elementRef]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateStringProp(element, 'iframe-style', iframeStyle, 'iframeStyle');
    }, [iframeStyle, elementRef]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      updateBooleanProp(element, 'iframe-auth', iframeAuth, 'iframeAuth');
    }, [iframeAuth, elementRef]);

    return (
      <tableau-pulse
        ref={elementRef}
        className={className}
        style={{ ...baseStyle, ...style }}
      />
    );
  }
);

TableauViz.displayName = 'TableauViz';
TableauPulse.displayName = 'TableauPulse';
