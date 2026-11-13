import type { Metadata } from 'next';
import Tools from '@/components/Tools';

export const metadata: Metadata = {
  title: 'Tools | Sam Shahsavani',
  description: 'Browser tools for architecture workflows. Use Survey Basis to prepare survey DXFs for Revit, with no uploads or accounts.',
  alternates: { canonical: '/tools/' },
  openGraph: { title: 'Tools | Sam Shahsavani', description: 'Small tools for drawing, data, and delivery.', url: '/tools/' },
  twitter: { card: 'summary', title: 'Tools | Sam Shahsavani', description: 'Small tools for drawing, data, and delivery.' },
};

export default function ToolsPage() {
  return <main><Tools standalone /></main>;
}
