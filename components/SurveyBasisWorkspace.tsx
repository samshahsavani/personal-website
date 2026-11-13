'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/components/ThemeProvider';

export default function SurveyBasisWorkspace() {
  const frame = useRef<HTMLIFrameElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const sendTheme = () => frame.current?.contentWindow?.postMessage({ type: 'survey-basis:theme', theme }, '*');
    const handleReady = (event: MessageEvent) => {
      if (event.source === frame.current?.contentWindow && event.data?.type === 'survey-basis:ready') sendTheme();
    };
    sendTheme();
    window.addEventListener('message', handleReady);
    return () => window.removeEventListener('message', handleReady);
  }, [theme]);

  return (
    <iframe
      ref={frame}
      src="/tools/survey-basis/workspace.html"
      title="Survey Basis drawing workspace"
      sandbox="allow-scripts allow-downloads"
      referrerPolicy="no-referrer"
      onLoad={() => frame.current?.contentWindow?.postMessage({ type: 'survey-basis:theme', theme }, '*')}
      className="block w-full h-[900px] lg:h-[max(640px,calc(100svh-260px))] border-0"
    />
  );
}
