import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author, but does not render its url or number of likes', () => {
  const blog = {
    title: 'example-title',
    author: 'example-author',
    url: 'example-url',
    likes: 24
  }

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).toHaveTextContent(
    blog.title
  )

  expect(component.container).toHaveTextContent(
    blog.author
  )

  expect(component.container).not.toHaveTextContent(
    blog.url
  )

  expect(component.container).not.toHaveTextContent(
    `${blog.likes}`
  )
})
