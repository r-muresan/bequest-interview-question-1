import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock window.crypto.subtle.digest for generating hash
(window as any).crypto = {
  subtle: {
    digest: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4, 5])),
  },
};

// Mock fetch API responses
const mockFetch = (body: any) =>
  jest.fn().mockResolvedValue({ json: () => Promise.resolve(body) });

class TextEncoderMock {
    encode(data: string) {
        return Buffer.from(data, 'utf-8');
    }
}

global.TextEncoder = TextEncoderMock as any;

describe('App component', () => {
  beforeEach(() => {
    (global as any).fetch = mockFetch({ data: 'Test data', hash: '0504030201' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the App component correctly', async () => {
    const { getByText, getByRole } = render(<App />);
    expect(getByRole('textbox')).toHaveValue('');

  });

  it('updates data when Update Data button is clicked', async () => {
    const { getByText, getByRole } = render(<App />);
    const updateButton = getByText('Update Data');

    fireEvent.change(getByRole('textbox'), { target: { value: 'New data' } });
    fireEvent.click(updateButton);

    await waitFor(() => expect((global as any).fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(getByRole('textbox')).toHaveValue('New data'));
  });

  it('verifies data integrity when Verify Data button is clicked', async () => {
    const { getByText } = render(<App />);
    const verifyButton = getByText('Verify Data');
    const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

    (global as any).fetch = mockFetch({ data: 'Test data', hash: '0504030201' });

    fireEvent.click(verifyButton);

    await waitFor(() =>
      expect(console.log).toHaveBeenCalledWith('Data integrity verified:', true)
    );
    mockConsoleLog.mockRestore();
  });
});