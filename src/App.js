import styled from "styled-components";
import { ShoppingList } from "./components/ShoppingList";

function App() {
  return (
    <Container>
      <ShoppingList />
    </Container>
  );
}

const Container = styled.main`
  max-width: 30rem;
  padding: 1.5rem 0.75rem;
  margin: 0 auto;
`;

export default App;
