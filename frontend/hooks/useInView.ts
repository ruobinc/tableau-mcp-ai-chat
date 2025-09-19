"use client";

import { RefObject, useEffect, useRef, useState } from "react";

export interface UseInViewOptions extends IntersectionObserverInit {
  once?: boolean;
}

export const useInView = <T extends Element>(
  options: UseInViewOptions = {}
): { ref: RefObject<T>; isInView: boolean } => {
  const { once = true, ...observerOptions } = options;
  const elementRef = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);
  const optionsRef = useRef<IntersectionObserverInit>(observerOptions);

  useEffect(() => {
    optionsRef.current = observerOptions;
  }, [observerOptions]);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) {
      return;
    }

    if (isInView && once) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsInView(false);
        }
      });
    }, optionsRef.current);

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [isInView, once]);

  return { ref: elementRef, isInView };
};

export default useInView;
