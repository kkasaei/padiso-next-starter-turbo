import * as React from 'react';

interface ReportLayoutProps {
  children: React.ReactNode;
}

export default function ReportLayout({
  children
}: ReportLayoutProps): React.JSX.Element {
  return <>{children}</>;
}

