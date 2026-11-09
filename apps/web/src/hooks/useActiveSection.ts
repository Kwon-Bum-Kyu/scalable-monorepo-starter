/**
 * 콜백마다 모든 섹션의 위치를 읽어, 뷰포트 위 30% 선을 지나간 마지막 섹션을 현재 섹션으로 둔다.
 * 모두 선 아래면 첫 섹션이다. 한계: 페이지 끝의 짧은 섹션은 스크롤만으로는 활성이 되지 않을 수 있다(클릭 선택은 setActiveId로 정확하다).
 */
import { useEffect, useRef, useState } from "react";

export function useActiveSection<T extends string>(
  ids: ReadonlyArray<T>,
): { activeId: T; setActiveId: (id: T) => void } {
  const [activeId, setActiveId] = useState<T>(ids[0] as T);
  const pinnedRef = useRef<T | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      () => {
        if (pinnedRef.current !== null) return;
        const line = window.innerHeight * 0.3;
        const passed = ids.filter((id) => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= line);
        setActiveId(passed[passed.length - 1] ?? (ids[0] as T));
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    const unpin = () => {
      pinnedRef.current = null;
    };
    window.addEventListener("wheel", unpin, { passive: true });
    window.addEventListener("touchmove", unpin, { passive: true });
    window.addEventListener("keydown", unpin);
    return () => {
      observer.disconnect();
      window.removeEventListener("wheel", unpin);
      window.removeEventListener("touchmove", unpin);
      window.removeEventListener("keydown", unpin);
    };
  }, [ids]);

  return {
    activeId,
    setActiveId: (id) => {
      pinnedRef.current = id;
      setActiveId(id);
    },
  };
}
