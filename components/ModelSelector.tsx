import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { storeData, getData } from '~/utils/asyncStorage';

function ModelSelector() {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const [selectedModel, setSelectedModel] = useState<Option>({ value: 'dall-e-2', label: 'Dalle 2' });

  useEffect(() => {
    async function fetchData() {
      const storedModel = await getData('selectedModel');
      if (storedModel) {
        const model = storedModel === 'dall-e-2' ? { value: 'dall-e-2', label: 'Dalle 2' } : { value: 'dall-e-3', label: 'Dalle 3' };
        setSelectedModel(model);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedModel) return;
    storeData('selectedModel', selectedModel.value);
  }, [selectedModel]);

  return (
    <Select 
      value={selectedModel}
      onValueChange={(option) => {
        setSelectedModel(option);
      }}
      className='w-28'
    >
      <SelectTrigger className=''>
        <SelectValue
          className='text-foreground text-sm native:text-lg'
          placeholder='Select a model'
        />
      </SelectTrigger>
      <SelectContent insets={contentInsets} className=''>
        <SelectGroup>
          <SelectItem label='Dalle 2' value='dall-e-2'>
            Dalle 2
          </SelectItem>
          <SelectItem label='Dalle 3' value='dall-e-3'>
            Dalle 3
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default ModelSelector;