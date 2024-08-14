import { ReactNode } from 'react';
import { Skeleton } from '@ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';

type StatsCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  loading: boolean;
  className: string;
  helperText: string;
};

export default function StatsCard({
  icon,
  title,
  value,
  loading,
  className,
  helperText,
}: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>
          {loading ? (
            <Skeleton>
              <span className='opacity-0'>0</span>
            </Skeleton>
          ) : (
            value
          )}
        </div>
        <p className='pt-1 text-xs text-muted-foreground'>{helperText}</p>
      </CardContent>
    </Card>
  );
}
