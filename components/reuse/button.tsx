import React from 'react';
import { Button } from '../ui/button';

interface ReuseButtonProps {
  title: string;
  color?: string;
  onClick?: () => void; 
}

function ReuseButton({ title, color, onClick }: ReuseButtonProps) {
  return (
    <Button
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {title}
    </Button>
  );
}

export default ReuseButton;
