import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [message, setMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [user, setUser] = useState(null)

  const createFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage({ text: `Logged in as ${user.name}`, type: 'info' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage({ text: 'wrong credentials', type: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    setMessage({ text: 'Logout succeeded', type: 'info' })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const createNewBlog = async (blogObj) => {
    try {
      const blog = await blogService.create(blogObj)
      createFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(blog))
      setMessage({ text: 'Created a new blog', type: 'info' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch {
      setMessage({ text: 'Failed to create a new blog', type: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }


  const newBlogForm = () => (
    <Togglable buttonLabel='create new blog' ref={createFormRef}>
      <BlogForm createNewBlog={createNewBlog} />
    </Togglable>
  )

  return (
    <div>
      <Notification message={message} />
      <h2>blogs</h2>

      {user === null
        ? loginForm()
        :
        <>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          {newBlogForm()}
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )
          }
        </>
      }
    </div>
  )
}

export default App