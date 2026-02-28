/// <reference types="vite/client" />

import type { ObjectDirective } from 'vue';
import { useHeartbeatDirective } from './directives/Heartbeat';

declare module 'vue' {
  interface GlobalDirectives {
    heartbeat: ReturnType<typeof useHeartbeatDirective>;
  }
}
