import { Fragment } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

interface PolicyStat {
  value: string;
  label: string;
}

interface Props {
  stats: PolicyStat[];
}

export function PolicyStatsResizable({ stats }: Props) {
  const defaultSize = 100 / stats.length;

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="mt-8 min-h-28 w-full border-y border-border"
      aria-label="Key policy numbers"
    >
      {stats.map((stat, index) => (
        <Fragment key={stat.label}>
          <ResizablePanel defaultSize={defaultSize} minSize={18} className="min-w-0">
            <Card className="h-full rounded-none border-0 shadow-none ring-0" size="sm">
              <CardContent className="flex h-full min-h-28 flex-col justify-center gap-1 px-3 py-4 sm:px-4">
                <strong className="font-heading text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  {stat.value}
                </strong>
                <span className="text-sm leading-6 text-muted-foreground">{stat.label}</span>
              </CardContent>
            </Card>
          </ResizablePanel>
          {index < stats.length - 1 && <ResizableHandle />}
        </Fragment>
      ))}
    </ResizablePanelGroup>
  );
}
