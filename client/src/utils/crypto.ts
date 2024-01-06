export const generateHash = async (input: string | undefined) => {
	const encoder = new TextEncoder();
	const data = encoder.encode(input);
	const hash = await window.crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hash));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return hashHex;
};

export const checkHash = async (input: string | undefined, hash: string) => {
	const expectedHash = await generateHash(input);
	return hash === expectedHash;
};
