import { SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';

interface Props {
  placeholder: string;
}

const SelectUserTrigger = ({ placeholder }: Props) => {
  return (
    <SelectTrigger className="w-full" id="dmcidci">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
  );
};

export default SelectUserTrigger;
