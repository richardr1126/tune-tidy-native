import { useState, memo } from 'react';
import { Select, Heading, Center, Spinner, VStack, FlatList, Box, HStack, Spacer } from "native-base";
import ArtistCard from '../../cards/ArtistCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function TopArtists({ topArtists }) {
  const [timeRange, setTimeRange] = useState("medium_term");
  const timeRanges = [
    { label: "Last Month", value: "short_term" },
    { label: "Last 6 Months", value: "medium_term" },
    { label: "All Time", value: "long_term" },
  ];

  return (
    <VStack my={'59px'} mx={'25px'}>
      <HStack alignItems={'center'}>
        <Heading size={'xl'} flex={1}>Top Artists</Heading>
        <Select
          minWidth={135}
          selectedValue={timeRange}
          accessibilityLabel="Choose Time Range"
          placeholder="Choose Time Range"
          onValueChange={setTimeRange}
          variant='filled'
          bgColor={'white'}
          fontWeight={'medium'}
          color={'#5e5e5e'}
          dropdownIcon={<Icon name="calendar" size={20} color={'#5e5e5e'} style={{ marginRight: 5 }} />}
        >
          {timeRanges.map(({ label, value }) => (
            <Select.Item label={label} value={value} key={value} borderRadius={'sm'} />
          ))}
        </Select>
      </HStack>



      {topArtists[timeRange]
        ? (
          <FlatList
            mt={2}
            minH={'100%'}
            data={topArtists[timeRange].items}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<Box height={10} />}
            renderItem={({ item, index }) => <ArtistCard item={item} index={index} />}
            keyExtractor={item => item.id}
          />

        ) : (
          <Center m={20}>
            <Spinner accessibilityLabel="Loading..." size={'sm'} color={'grey'} />
          </Center>
        )
      }
    </VStack>
  );
};

export default memo(TopArtists);
