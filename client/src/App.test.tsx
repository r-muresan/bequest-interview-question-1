import fetchMock from "jest-fetch-mock";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom/extend-expect";
import { TextEncoder, TextDecoder } from "util";

Object.assign(global, { TextDecoder, TextEncoder });

beforeAll(() => {
  fetchMock.enableMocks();
});

// Reset the mock before each test
beforeEach(() => {
  fetchMock.resetMocks();
});

test("it should handle data tampering detection and recovery", async () => {
  // Mock the fetch GET request with the wrong hash for data verification
  fetchMock.mockResponseOnce(
    // Correct hash is a5559611aa3b578ca349404403f3710bbc333d9e3b5798211f44379e58982c83
    JSON.stringify({ data: "Tampered Data", hash: "wrongHash" })
  );
  // Mock the fetch GET request with the correct hash for data recovery
  fetchMock.mockResponseOnce(
    JSON.stringify({
      data: "Backup Data",
      hash: "a5559611aa3b578ca349404403f3710bbc333d9e3b5798211f44379e58982c83",
    })
  );
  render(<App />);
  // Wait for the data to be fetched and displayed
  await waitFor(() => {
    //@ts-ignore
    expect(screen.getByTestId("data-input").value).toBe("Tampered Data");
  });
  // Verify the data
  fireEvent.click(screen.getByText("Verify Data"));
  // Wait for the data to be verified
  await waitFor(() => {
    expect(screen.getByText("Data is tampered")).toBeInTheDocument();
  });
  // Wait for the data to be recovered
  await waitFor(() => {
    //@ts-ignore
    expect(screen.getByTestId("data-input").value).toBe("Backup Data");
  });
  // Verify the data again
  fireEvent.click(screen.getByText("Verify Data"));
  // Wait for the data to be verified
  await waitFor(() => {
    expect(screen.getByText("Data is not tampered")).toBeInTheDocument();
  });
});
