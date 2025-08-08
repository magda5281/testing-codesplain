import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';
import createServer from '../../test/server';
import AuthButtons from './AuthButtons';
// import { pause } from '../../util/pause';
async function renderComponent() {
  render(
    <SWRConfig value={{ provider: () => new Map(), revalidateOnFocus: false }}>
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  );
  await screen.findAllByRole('link');
}
//createServer() --->GET "/api/user" ---> {user:null}
describe('when user is not signed in', () => {
  createServer([
    {
      method: 'get',
      path: '/api/user',
      res: (req, res, ctx) => {
        return { user: null };
      },
    },
  ]);
  test('sign in and sign up buttons are visible', async () => {
    await renderComponent();
    const signInButton = screen.getByRole('link', { name: /sign in/i });
    const signUpButton = screen.getByRole('link', { name: /sign up/i });
    expect(signInButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute('href', '/signin');
    expect(signUpButton).toHaveAttribute('href', '/signup');
  });
  test('sign out is not visible', async () => {
    await renderComponent();
    const signOutButton = screen.queryByRole('link', { name: /sign out/i });
    expect(signOutButton).not.toBeInTheDocument();
  });
});

describe('when user is signed in', () => {
  //createServer() ---> GET "/api/user" ---> {user:{id:1, email:test@test.com}}
  createServer([
    {
      method: 'get',
      path: '/api/user',
      res: (req, res, ctx) => {
        return { user: { id: 3, email: 'test3@test.com' } };
      },
    },
  ]);
  test('sign in and sign up are not visible', async () => {
    renderComponent();
    const signInButton = screen.queryByRole('link', { name: /sign in/i });
    const signUpButton = screen.queryByRole('link', { name: /sign up/i });
    expect(signInButton).not.toBeInTheDocument();
    expect(signUpButton).not.toBeInTheDocument();
  });
  test('sign out is visible', async () => {
    renderComponent();

    const signOutButton = await screen.findByRole('link', {
      name: /sign out/i,
    });
    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton).toHaveAttribute('href', '/signout');
  });
});
