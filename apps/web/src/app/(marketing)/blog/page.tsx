import * as React from 'react';
import type { Metadata } from 'next';

import { BlogPosts } from '@/components/marketing/sections/BlogPosts';
import { createTitle } from '@workspace/common/lib';
import { BlogListingJsonLd, BreadcrumbJsonLd } from '@/components/marketing/JsonLd';
import { baseURL } from '@workspace/common';

export const metadata: Metadata = {
  title: createTitle('Blog')
};

export default function BlogPage(): React.JSX.Element {
  return (
    <>
      <BlogListingJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: baseURL },
          { name: 'Blog', url: `${baseURL}/blog` },
        ]}
      />
      <BlogPosts />
    </>
  );
}
