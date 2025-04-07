import React from 'react';
import styled from 'styled-components';

const Input = () => {
  return (
    <PageWrapper>
      <Title>Add a Task</Title>
      <InputContainer>
        <StyledInput placeholder="Add a task..." />
        <ItemsList>
          {[...Array(7)].map((_, index) => (
            <InputItem key={index} />
          ))}
        </ItemsList>
      </InputContainer>
    </PageWrapper>
  );
};

export default Input;

// Styled Components

const PageWrapper = styled.div`
  background-color: #F3F4FB;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const InputContainer = styled.div`
  background: white;
  width: 50%;
  height: 35rem;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  right: 2rem;
`;

const Title = styled.h2`
  position: absolute;
  top: 2rem;
  left: 2rem;
  font-size: 1.2rem;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 2px solid #4285f4;
  border-radius: 0.75rem;
  background-color: #e3e6ff;
  outline: none;
  font-size: 1rem;

`;

const ItemsList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputItem = styled.div`
  background-color: #e3e6ff;
  border-radius: 0.75rem;
  height: 2.5rem;
  width: 100%;
`;
