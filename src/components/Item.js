import { useCallback } from "react";
import styled from "styled-components";

export function Item({ item, onSelect }) {
  const handleClick = useCallback(() => onSelect(item), [onSelect, item]);
  return <ItemButton onClick={handleClick}>{item.name.de}</ItemButton>;
}
const ItemButton = styled.button`
  -webkit-appearance: none;
  border: 1px solid transparent;
  padding: 0.6em 1.7em 0.55em 1.7em;
  background-color: lightblue;
  border-radius: 0.5em;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    border: 1px solid black;
  }
`;
