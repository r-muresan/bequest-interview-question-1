import { useEffect, useState } from "react";

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

function App() {
	const [localData, setLocalData] = useState<string>("");

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const response = await fetch(API_URL);
		const { data, hash } = await response.json();
		localStorage.setItem("hash", hash);
		setLocalData(data);
	};

	const updateData = async () => {
		const newHash = await generateHash(localData);
		await fetch(API_URL, {
			method: "POST",
			body: JSON.stringify({ data: localData, hash: newHash }),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});

		await getData();
	};

	const verifyData = async () => {
		const response = await fetch(API_URL);
		const { data, hash } = await response.json();
		const expectedHash = await generateHash(data);
		if (hash !== localStorage.getItem("hash") || expectedHash !== hash) {
			alert("Data is not valid!!");
		}
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
			</div>
		</div>
	);
}

export default App;
