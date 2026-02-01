'use client';

import dynamic from 'next/dynamic';

const MdxClient = dynamic(
  () => import('./mdx-component-client').then((mod) => ({ default: mod.MdxClient })),
  {
    ssr: false,
    loading: () => (
      <div className="mdx">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
      </div>
    )
  }
);

type MdxProps = {
  code: string;
};

export function Mdx({ code }: MdxProps) {
  return <MdxClient code={code} />;
}
