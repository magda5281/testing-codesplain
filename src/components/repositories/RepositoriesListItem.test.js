import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import RepositoriesListItem from './RepositoriesListItem';

//use jest.mock() to pretend to be another file - it is not preffered solution to act warning:
// jest.mock('../tree/FileIcon', () => {
//   //it replaces contents of FileIcon.js
//   return () => {
//     return 'FileIcon Component';
//   };
// });
function renderComponent() {
  const repository = {
    full_name: 'facebook/react',
    language: 'Javascript',
    description: 'A js library',
    owner: { login: 'facebook' },
    name: 'react',
    html_url: 'https://github.com/facebook/react',
  };
  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );
  return { repository };
}

test('shows a link to the github homepage for this repository', async () => {
  const { repository } = renderComponent();
  //find the element whihc causes act warning and await it
  await screen.findByRole('img', { name: 'Javascript' });

  //the worst solution of act warning :
  // await act(async () => {
  //   await pause();
  // });

  const link = screen.getByRole('link', { name: /github repository/i });
  expect(link).toHaveAttribute('href', repository.html_url);
});

// const pause = () => new Promise((resolve) => setTimeout(resolve, 100));

test('shows a fileIcon with appropriate icon', async () => {
  renderComponent();
  const icon = await screen.findByRole('img', { name: 'Javascript' });
  expect(icon).toHaveClass('js-icon');
});

test('shows a link to code editor page', async () => {
  const { repository } = renderComponent();
  await screen.findByRole('img', { name: 'Javascript' });
  const link = await screen.findByRole('link', {
    name: new RegExp(repository.owner.login),
  });
  expect(link).toHaveAttribute('href', `/repositories/${repository.full_name}`);
});
