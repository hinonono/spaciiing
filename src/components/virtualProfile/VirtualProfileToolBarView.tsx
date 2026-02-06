import React, { useEffect, useRef } from 'react';

interface VirtualProfileToolBarViewProps {
  leftItems: React.ReactNode[];
  rightItems: React.ReactNode[];
}

// Virtual Profile 頁面上方的工具列（收攏、存檔、建立資料夾、建立預設）
const VirtualProfileToolBarView: React.FC<VirtualProfileToolBarViewProps> = ({
  leftItems,
  rightItems
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const toolbarRefLeft = useRef<HTMLDivElement>(null);
  const toolbarRefRight = useRef<HTMLDivElement>(null);

  // 判斷Toolbar是否離開畫面可見範圍
  useEffect(() => {
    if (!sentinelRef.current) return;

    const toolbars = [toolbarRefLeft.current, toolbarRefRight.current].filter(
      Boolean
    ) as HTMLDivElement[];

    const observer = new IntersectionObserver(
      ([entry]) => { toolbars.forEach((el) => { el.classList.toggle("is-sticky", !entry.isIntersecting); }); },
      { root: null, threshold: 0, }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="sticky-sentinel" />
      <div className="flex flex-justify-space-between virtual-profile-toolbar-container">
        <div ref={toolbarRefLeft} className="virtual-profile-toolbar">{leftItems}</div>
        <div ref={toolbarRefRight} className="flex flex-row virtual-profile-toolbar">{rightItems}</div>
      </div>
    </>
  );
};

export default VirtualProfileToolBarView;
