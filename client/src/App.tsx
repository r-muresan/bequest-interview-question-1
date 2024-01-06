import { useCallback, useEffect, useState } from "react";
import { generateHash, checkHash } from "./utils/crypto";

const API_URL = "http://localhost:8080";

type Data = {
	data: string;
	hash: string;
};

function App() {
	const [localData, setLocalData] = useState<string>("");

	const getData = useCallback(async () => {
		const response = await fetch(API_URL);
		return (await response.json()) as Data;
	}, []);

	const updateData = useCallback(async () => {
		const newHash = await generateHash(localData);
		await fetch(API_URL, {
			method: "POST",
			body: JSON.stringify({ data: localData, hash: newHash }),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});

		const { data, hash } = await getData();
		localStorage.setItem("hash", hash);
		localStorage.setItem("data", data);
	}, [getData, localData]);

	const getInitialData = useCallback(async () => {
		const { data, hash } = await getData();
		if (await checkHash(data, hash)) {
			localStorage.setItem("hash", hash);
			localStorage.setItem("data", data);
			setLocalData(data);
		} else {
			// Recover from localStorage
			const localStorageData = localStorage.getItem("data");
			if (localStorageData) {
				setLocalData(localStorageData);
				alert(
					"Data is NOT valid, restoring localStorage data: " + localStorageData
				);
			} else {
				alert("Data is NOT valid, no localStorage data found");
			}
		}
	}, [getData]);

	const verifyData = async () => {
		const response = await fetch(API_URL);
		const { data, hash } = await response.json();
		const expectedHash = await generateHash(data);
		if (hash !== localStorage.getItem("hash") || expectedHash !== hash) {
			alert("Data is NOT valid");
		} else {
			alert("Data is valid");
		}
	};

	const hackData = async () => {
		await fetch(API_URL + "/hack");
	};

	useEffect(() => {
		getInitialData();
	}, [getInitialData]);

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				padding: 0,
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
				gap: "20px",
				fontSize: "30px",
			}}
		>
			<div>Saved Data</div>
			<input
				style={{ fontSize: "30px" }}
				type="text"
				value={localData}
				onChange={(e) => setLocalData(e.target.value)}
			/>

			<div style={{ display: "flex", gap: "10px" }}>
				<button style={{ fontSize: "20px" }} onClick={updateData}>
					Update Data
				</button>
				<button style={{ fontSize: "20px" }} onClick={verifyData}>
					Verify Data
				</button>
				<button style={{ fontSize: "20px" }} onClick={hackData}>
					Hack Data
				</button>
			</div>
		</div>
	);
}

export default App;
