"use client";

import * as React from "react";
import { CacheProvider } from "@emotion/react";
import createCache, { EmotionCache } from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";

interface ThemeRegistryProps {
  children: React.ReactNode;
}

interface EmotionCacheRecord {
  cache: EmotionCache;
  flush: () => string[];
}

const createEmotionCacheRecord = (key: string): EmotionCacheRecord => {
  const cache = createCache({ key });
  cache.compat = true;

  const prevInsert = cache.insert;
  let inserted: string[] = [];

  cache.insert = (...args: Parameters<typeof prevInsert>) => {
    const [, serialized] = args;
    if (!cache.inserted[serialized.name]) {
      inserted.push(serialized.name);
    }
    return prevInsert(...args);
  };

  const flush = () => {
    const prev = inserted;
    inserted = [];
    return prev;
  };

  return { cache, flush };
};

export const ThemeRegistry: React.FC<ThemeRegistryProps> = ({ children }) => {
  const [{ cache, flush }] = React.useState<EmotionCacheRecord>(() =>
    createEmotionCacheRecord("mui")
  );

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }

    let styles = "";
    for (const name of names) {
      const style = cache.inserted[name];
      if (typeof style === "string") {
        styles += style;
      }
    }

    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
};

export default ThemeRegistry;
