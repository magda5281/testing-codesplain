import { render, screen } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';
import HomeRoute from './HomeRoute';
import createServer from '../test/server';

createServer([
  {
    path: '/api/repositories',
    res: (req, res, ctx) => {
      const language = req.url.searchParams.get('q').split('language:')[1];
      return {
        items: [
          { id: 1, full_name: `${language}_one` },
          { id: 2, full_name: `${language}_two` },
        ],
      };
    },
  },
]);

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
    expect(links[0]).toHaveAttribute('href', `/repositories/${lang}_one`);
    expect(links[1]).toHaveAttribute('href', `/repositories/${lang}_two`);
  }
});

// const pause = () =>
//   new Promise((resolve) => {
//     setTimeout(resolve, 100);
//   });
