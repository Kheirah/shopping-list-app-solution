import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Item } from "./Item";
import { search } from "fast-fuzzy";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
} from "../utils/localStorage";

const LOCAL_STORAGE_KEY = "shopping-list-active-items";

export function ShoppingList() {
  const [allItems, setAllItems] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [symmetricDifference, setSymmetricDifference] = useState([]);
  const [activeItems, setActiveItems] = useState(
    loadFromLocalStorage(LOCAL_STORAGE_KEY) ?? []
  );

  const searchInputElement = useRef();

  useEffect(() => {
    fetchData("items");

    async function fetchData(resource) {
      try {
        const response = await fetch(
          `https://fetch-me.vercel.app/api/shopping/${resource}`
        );
        const results = await response.json();
        setAllItems(results.data);
      } catch (error) {
        console.error(error.message);
      }
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage(LOCAL_STORAGE_KEY, activeItems);
  }, [activeItems]);

  useEffect(() => {
    setSymmetricDifference(
      allItems.filter(
        ({ _id: id1 }) => !activeItems.find(({ _id: id2 }) => id1 === id2)
      )
    );
  }, [activeItems, allItems]);

  useEffect(() => {
    const results = search(searchInput, symmetricDifference, {
      keySelector: ({ name }) => name.de,
    }).slice(0, 11);
    setFilteredItems(results || []);
  }, [searchInput, symmetricDifference]);

  function handleOnAdd(item) {
    setActiveItems([...activeItems, item]);
    setFilteredItems([]);
    setSearchInput("");
    searchInputElement.current.value = "";
    searchInputElement.current.focus();
  }

  function handleOnRemove(item) {
    setActiveItems(
      activeItems.filter((activeItem) => activeItem._id !== item._id)
    );
  }

  return (
    <Stack space="1rem">
      <Header>
        <h1>{"Einkaufsliste"}</h1>
      </Header>
      <Stack space="2rem">
        <ItemList>
          {activeItems.map((item) => (
            <Item
              key={item._id}
              item={item}
              onSelect={handleOnRemove}
              type={"active"}
            >
              {item}
            </Item>
          ))}
        </ItemList>
        <h2>Was willst du einkaufen?</h2>
        <SearchInput
          ref={searchInputElement}
          type="text"
          placeholder="Tippe um zu suchen..."
          onChange={(event) => setSearchInput(event.target.value)}
        />
        <ItemList>
          {searchInput && !filteredItems.length ? (
            <div>no results found</div>
          ) : null}
          {filteredItems.length
            ? filteredItems.map((item) => (
                <Item key={item._id} item={item} onSelect={handleOnAdd}>
                  {item.name.de}
                </Item>
              ))
            : null}
        </ItemList>
      </Stack>
    </Stack>
  );
}

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const SearchInput = styled.input`
  -webkit-appearance: none;
  border: 1px solid lightgrey;
  font: inherit;
  padding: 0.6em 1.7em 0.55em 1.7em;
  border-radius: 0.5em;
  width: 100%;
`;

const ItemList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ space }) => space ?? "1.5rem"};
`;
