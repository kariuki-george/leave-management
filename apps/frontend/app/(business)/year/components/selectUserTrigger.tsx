import { SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';

const SelectUserTrigger = () => {
  return (
    <SelectTrigger className="w-full" id="dmcidci">
      <SelectValue placeholder="Select User" />
    </SelectTrigger>
  );
};

export default SelectUserTrigger;
