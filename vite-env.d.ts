/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REMOTE_SERVER?: string;
  readonly VITE_API_BASE?: string;
  readonly VITE_NODE_ENV?: string;
  readonly VITE_APP_TITLE?: string;
  readonly VITE_PORT?: string;
  // Add other VITE_ prefixed env vars as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// React DOM client types
declare module 'react-dom/client' {
  import { Container, ReactNode } from 'react';
  
  export interface Root {
    render(children: ReactNode): void;
    unmount(): void;
  }
  
  export function createRoot(container: Container): Root;
  export function hydrateRoot(container: Container, initialChildren: ReactNode): Root;
}

// 添加对图片模块的声明
declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
} 