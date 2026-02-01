import * as React from 'react';
import type { Metadata } from 'next';

import { BlogPosts } from '@/components/marketing/sections/BlogPosts';
import { createTitle } from '@workspace/common/lib';

export const metadata: Metadata = {
  title: createTitle('Blog')
};

export default function BlogPage(): React.JSX.Element {
  return <BlogPosts />;
}
