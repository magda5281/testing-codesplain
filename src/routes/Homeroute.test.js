import { render, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import HomeRoute from './HomeRoute';

const handlers = [
  rest.get('/api/repositories', (req, res, ctx) => {
    const language = req.url.searchParams.get('q').split('language:')[1];
    return res(
      ctx.json({
        items: [
          { id: 1, full_name: `${language}_one` },
          { id: 2, full_name: `${language}_two` },
        ],
      })
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

test('renders two links for each table', async () => {
  render(
    <MemoryRouter>
      <HomeRoute />
    </MemoryRouter>
  );
  //loop over each language
  const languages = ['javascript', 'typescript', 'rust', 'go', 'ruby', 'java'];
  for (let lang of languages) {
    //for each language , make sure we see two links
    const links = await screen.findAllByRole('link', {
      name: new RegExp(`${lang}_`),
    });
    // Assert that the links have the appropriate full name
    expect(links).toHaveLength(2);
    //Assert correct name
    expect(links[0]).toHaveTextContent(`${lang}_one`);
    expect(links[1]).toHaveTextContent(`${lang}_two`);
    expect(links[0]).toHaveAttribute(`/repositories/${lang}_one`);
    expect(links[1]).toHaveAttribute(`/repositories/${lang}_two`);
  }
});

// const pause = () =>
//   new Promise((resolve) => {
//     setTimeout(resolve, 100);
//   });
