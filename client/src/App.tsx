import React, { useEffect, useState, useRef } from "react";
import { getToken, savedToken } from "./functions/index.ts";
import { getDataUser, login, updateDataUser } from "./api/index.ts";
import { HistoryListName } from "./components/HistoryListName/index.tsx";
import {
  Form,
  Label,
  Input,
  Button,
  ContainerFormData,
  SubtitleForm,
  ContainerButton,
  ContainerButtonLogout,
  SecondaryButton,
  LogOutButton,
  PageContainer,
  Title,
} from "./styled.ts";

function App() {
  const [token, setToken] = useState(getToken());

  const [dataUser, setData] = useState({});
  const [activeList, setActiveList] = useState(false);
  const inputRef = useRef(dataUser?.["name"]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const getData = async () => {
        try {
          const data = await getDataUser(token);
          setData(data[0]);
        } catch (error) {
          console.error("Error! we cannot obtain the data");
        } finally {
          setIsLoading(false);
        }
      };
      getData();
    } else {
      setIsLoading(false);
    }
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const password = e.target.password.value;
    const response = await login(name, password);

    setToken(response.token);
    const dataUser = await getDataUser(response.token);

    setData(dataUser[0]);
  };
  const handleLogout = async () => {
    localStorage.removeItem("auth_token");
    setToken("");
    setData({});
  };

  const updateData = async () => {
    if (activeList == true) setActiveList(false);
    let updatedName = inputRef.current.value;
    if (!updatedName) alert("name is a required field");
    else {
      const savedUpdatedName = await updateDataUser(updatedName, token);
      setData(savedUpdatedName[0]);
      alert("User name changed :)");
    }
  };

  const verifyData = async () => {
    if (activeList == false) setActiveList(true);
    else setActiveList(false);
  };

  return (
    <PageContainer>
      {!token ? (
        <ContainerFormData>
          <Title>Inicio de sesion</Title>
          <Form onSubmit={handleLogin}>
            <Label htmlFor="">
              <Input type="text" name="name" placeholder="Name" />
            </Label>
            <Label htmlFor="">
              <Input type="password" name="password" placeholder="Password" />
            </Label>
            <Button>Enviar</Button>
          </Form>
        </ContainerFormData>
      ) : (
        <>
          <ContainerButtonLogout>
            {" "}
            <LogOutButton onClick={handleLogout}>Logout</LogOutButton>
          </ContainerButtonLogout>
          <ContainerFormData>
            <SubtitleForm>Saved Data</SubtitleForm>
            <Input
              style={{ fontSize: "30px" }}
              type="text"
              value={dataUser?.["name"] || ""}
              onChange={(e) => setData({ ...dataUser, name: e.target.value })}
              ref={inputRef}
            />

            <ContainerButton style={{ display: "flex", gap: "10px" }}>
              <SecondaryButton
                style={{ fontSize: "20px" }}
                onClick={updateData}
              >
                Update Data
              </SecondaryButton>
              <SecondaryButton
                style={{ fontSize: "20px" }}
                onClick={verifyData}
              >
                History Names
              </SecondaryButton>
            </ContainerButton>
            {activeList == true ? (
              <div>
                <HistoryListName />
              </div>
            ) : null}
          </ContainerFormData>
        </>
      )}
    </PageContainer>
  );
}

export default App;
