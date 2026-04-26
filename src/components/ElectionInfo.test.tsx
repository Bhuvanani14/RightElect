import React from 'react';
import { render, screen } from '@testing-library/react';
import ElectionInfo from './ElectionInfo';
import { SettingsProvider } from '../hooks/useSettings';

describe('ElectionInfo component', () => {
  beforeAll(() => {
    // mock fetch to avoid network requests on mount
    global.fetch = (input: any) => {
      const url = String(input);
      if (url.endsWith('/api/election-info')) {
        return Promise.resolve({ json: () => Promise.resolve({ nextElections: [], parliaments: [] }) } as any);
      }
      if (url.endsWith('/api/latest-updates')) {
        return Promise.resolve({ json: () => Promise.resolve({ articles: [] }) } as any);
      }
      return Promise.resolve({ json: () => Promise.resolve({}) } as any);
    } as any;
  });

  afterAll(() => {
    // @ts-ignore
    delete global.fetch;
  });

  it('renders header and detect button', () => {
    render(
      <SettingsProvider>
        <ElectionInfo />
      </SettingsProvider>
    );

    expect(screen.getByText('Your Election Hub')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Detect My Location/i })).toBeInTheDocument();
  });
});
