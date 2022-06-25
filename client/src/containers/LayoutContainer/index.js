import * as React from "react";
import Container from "react-bootstrap/Container";

function LayoutContainer({ children }) {
  return (
    <Container fluid="md">
      <h1 className="mt-3 mb-5">Talky</h1>
      {children}
    </Container>
  );
}

export default LayoutContainer;
