import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

const generateHash = async (input: string | undefined) => {
	const encoder = new TextEncoder();
	const data = encoder.encode(input);
	const hash = await window.crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hash));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return hashHex;
};

const checkHash = async (input: string | undefined, hash: string) => {
	const expectedHash = await generateHash(input);
	return hash === expectedHash;
};

function App() {
	const [localData, setLocalData] = useState<string>("");

	const getData: () => Promise<{ data: string; hash: string }> =
		useCallback(async () => {
			const response = await fetch(API_URL);
			const { data, hash } = await response.json();
			return { data, hash };
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
		if (!await checkHash(data, hash)) {
      // Recover from localStorage
			const localStorageData = localStorage.getItem("data");
			if (localStorageData) {
				console.log(
					"Data is not valid, restoring localStorage data:",
					localStorageData
				);
				setLocalData(localStorageData);
				// updateData();
			}
		} else {
			localStorage.setItem("hash", hash);
			localStorage.setItem("data", data);
			setLocalData(data);
		}
	}, [getData]);

	useEffect(() => {
		getInitialData();
	}, [getInitialData]);

	const verifyData = async () => {
		const response = await fetch(API_URL);
		const { data, hash } = await response.json();
		const expectedHash = await generateHash(data);
		if (hash !== localStorage.getItem("hash") || expectedHash !== hash) {
			alert("Data is not valid!!");
		} else {
			alert("Data is valid!!");
		}
	};

	const hackData = async () => {
		await fetch(API_URL + "/hack");
	};

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
