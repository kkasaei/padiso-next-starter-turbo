import * as React from 'react';
import { redirect } from 'next/navigation';

export default function ReportIndexPage(): React.JSX.Element {
  // Redirect to home page if someone visits /report directly
  redirect('/');
}

