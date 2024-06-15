import { memo } from 'react';
import { View } from 'react-native';
import { Skeleton } from '~/components/ui/skeleton';
import { Card, CardContent } from '~/components/ui/card';

function SkeletonCard() {
  return (
    <Card className='mx-2 bg-background'>
      <CardContent className='flex-row p-2 items-center gap-2 flex-wrap'>
        <Skeleton className="rounded-lg h-16 w-16" />

        <Skeleton className="rounded-lg h-6 flex-1" />

      </CardContent>
    </Card>
  );
}

export default memo(SkeletonCard);