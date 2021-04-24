import { render, screen } from '@testing-library/svelte';
import App from '../App.svelte';

describe('App.svelte', () => {
  it('renders Hello with `name` prop', () => {
    render(App, { name: 'foo' });
    expect(screen.queryByText(/hello foo/i)).toBeTruthy();
  });
});
