import {
  Card,
  CardContent,
} from '~/components/ui/card';
import { H1, P } from '~/components/ui/typography';
import { Pressable, View } from 'react-native';
import { Button } from '../ui/button';
import { XCircle } from '~/lib/icons/Close';
import { memo, useState } from 'react';
import { Edit } from '~/lib/icons/Edit';

function PlaylistListPopup() {
  const [hidden, setHidden] = useState(false);
  if (hidden) return <View className='h-2' />;

  return (
    <Card className='m-2 bg-popover shadow-none'>
      <CardContent className='flex-row py-2 px-2 items-center gap-4'>
        <Edit className='color-primary' />
        <P className='flex-1 text-left'>
          Here you can sort and manage your playlists.
          You can delete playlists or create AI cover art by swiping on your playlist.
          Please select a playlist to get started.
        </P>

        <Pressable onPress={() => setHidden(true)} className='self-start items-end'>
          <XCircle className='color-primary' size={17} />
        </Pressable>
      </CardContent>
    </Card>
  );
}

export default memo(PlaylistListPopup);