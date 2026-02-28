// src/directives/heartbeat.ts
import type { Directive, DirectiveBinding } from "vue";

export const useHeartbeatDirective = (): Directive => {
  return {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      let clickCount = 0;
      let timer: number | null = null;
      // 读取参数，设置默认值
      const { count = 4, className = "heartbeat" } = binding.value || {};

      const reset = () => {
        clickCount = 0;
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      };

      const handleClick = (e: MouseEvent) => {
        if (e.button !== 0) return; // 只响应左键点击

        clickCount++;

        if (clickCount === 1) {
          timer = window.setTimeout(reset, 800); // 超过时间则重置
        }

        if (clickCount === count) {
          reset();
          el.classList.add(className);
          setTimeout(() => {
            el.classList.remove(className);
          }, 600);
        }
      };

      el.addEventListener("click", handleClick);

      // 清理事件监听
      (el as any)._heartbeatCleanup = () => {
        el.removeEventListener("click", handleClick);
      };
    },
    unmounted(el: any) {
      el._heartbeatCleanup?.();
    },
  };
};
