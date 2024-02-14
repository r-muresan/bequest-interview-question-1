import styled from "styled-components";
export const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const Form = styled.form`
  max-width: 300px;
  display: grid;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`;
export const Label = styled.label`
  width: 100%;
  margin-bottom: 15px;
`;

export const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;
export const Button = styled.button`
  width: 100%;
  padding: 10px;

  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export const ContainerFormData = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  padding: 0;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  font-size: 30px;
`;
export const SubtitleForm = styled.h3`
  font-size: 36px;
  font-weight: bold;
  color: #6c757d;
  font-family: sans-serif;
`;
export const ContainerButton = styled.div`
  display: flex;
  gap: 10px;
`;
export const ContainerButtonLogout = styled.div`
  display: flex;
  width: 100%;
`;
export const SecondaryButton = styled.button`
  font-size: 20px;
  padding: 10px 20px;
  background-color: #6c757d;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export const LogOutButton = styled.button`
  font-size: 16px;
  padding: 10px 20px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  ::hover {
    background-color: #c82333;
  }
  :focus {
    outline: none;
  }
`;
export const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  font-family: sans-serif;
`;
