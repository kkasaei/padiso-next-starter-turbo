import '@/app/(marketing)/mdx.css';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allPosts } from 'content-collections';

import { baseURL } from '@workspace/common';

import { BlogPost } from '@/components/marketing/sections/BlogPost';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/marketing/JsonLd';

async function getBlogPostFromParams(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;
  if (!params) {
    return null;
  }
  const slug =
    (Array.isArray(params.slug) ? params.slug?.join('/') : params.slug) || '';
  const post = allPosts.find(
    (post) =>
      post.slugAsParams === slug || (!slug && post.slugAsParams === 'index')
  );
  if (!post) {
    return null;
  }
  return post;
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string[] }> }
): Promise<Metadata> {
  const post = await getBlogPostFromParams(props);
  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `${baseURL}${post.slug}`
    }
  };
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slugAsParams.split('/')
  }));
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string[] }> }) {
  const post = await getBlogPostFromParams(props);
  if (!post) {
    return notFound();
  }

  const postUrl = `${baseURL}${post.slug}`;

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        url={postUrl}
        datePublished={post.published}
        authorName={post.author?.name ?? 'SearchFIT'}
        authorAvatar={post.author?.avatar}
        category={post.category}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: baseURL },
          { name: 'Blog', url: `${baseURL}/blog` },
          { name: post.title, url: postUrl },
        ]}
      />
      <BlogPost post={post} />
    </>
  );
}
