import React from "react";
import { Button } from "../ui/button";

interface ReuseButtonProps {
  title: string;
  color?: string;
  onClick?: () => void;
}

function ReuseButton({ title, color, onClick }: ReuseButtonProps) {
  return (
    <Button type="button" style={{ backgroundColor: color }} onClick={onClick}>
      {title}
    </Button>
  );
}

export default ReuseButton;
