import { useEffect, useState } from "react";
import { getToken } from "../../functions/index.ts";
import React from "react";
import { getHistoryListNames } from "../../api/index.ts";
import { ContainerList, TitleList, UlList, LiList } from "./styled.ts";

export function HistoryListName() {
  const [token, setToken] = useState(getToken());

  const [listNames, setListNames] = useState([]);
  useEffect(() => {
    async function loadList() {
      setToken(token);
      const list = await getHistoryListNames(token);
      setListNames(list);
    }
    loadList();
  }, [token]);

  return (
    <ContainerList>
      <TitleList>History names</TitleList>
      <UlList>
        {listNames?.map((name) => (
          <LiList key={name["id"]}>{name["previousName"]}</LiList>
        ))}
      </UlList>
    </ContainerList>
  );
}
