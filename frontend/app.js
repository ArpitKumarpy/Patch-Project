// frontend/pages/_app.js
import '@/styles/globals.css'
import { AuthProvider } from '../context/AuthContext'

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

// frontend/pages/index.js
import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900">Loading...</div>
  }

  return (
    <Layout>
      <Head>
        <title>Patch-Project | Home</title>
        <meta name="description" content="A collaborative project-making platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">My Projects</h2>
            <p className="text-gray-300">Start creating or managing your projects</p>
            <button 
              onClick={() => router.push('/projects')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              View Projects
            </button>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Collaborations</h2>
            <p className="text-gray-300">Projects you're collaborating on</p>
            <button 
              onClick={() => router.push('/collaborations')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              View Collaborations
            </button>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Discover</h2>
            <p className="text-gray-300">Find new projects to collaborate on</p>
            <button 
              onClick={() => router.push('/discover')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Explore
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

// frontend/pages/login.js
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { login, loading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      await login(email, password)
      router.push('/')
    } catch (err) {
      setError('Failed to log in. Please check your credentials.')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Patch-Project | Login</title>
        <meta name="description" content="Login to Patch-Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-white">Patch-Project</h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-200">
            Sign in to your account
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-gray-200 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-gray-200 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Logging in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center text-gray-300">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

// frontend/pages/register.js
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
  })
  const [error, setError] = useState('')
  const router = useRouter()
  const { register, loading } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      await register(formData)
      router.push('/login')
    } catch (err) {
      setError('Registration failed. Please try again.')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Patch-Project | Register</title>
        <meta name="description" content="Register for Patch-Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-white">Patch-Project</h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-200">
            Create your account
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-gray-200 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="full-name" className="sr-only">Full Name</label>
              <input
                id="full-name"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name (optional)"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-gray-200 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
          
          <div className="text-center text-gray-300">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

// frontend/pages/projects/index.js
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import { fetchProjects, createProject } from '../../services/api'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'other'
  })
  const router = useRouter()
  const { user, token } = useAuth()

  useEffect(() => {
    const getProjects = async () => {
      try {
        const data = await fetchProjects(token)
        setProjects(data)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      getProjects()
    }
  }, [token])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewProject(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    try {
      const createdProject = await createProject(newProject, token)
      setProjects(prev => [...prev, createdProject])
      setShowModal(false)
      setNewProject({ title: '', description: '', category: 'other' })
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <Layout>
      <Head>
        <title>Patch-Project | Projects</title>
        <meta name="description" content="My Projects on Patch-Project" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">My Projects</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Create New Project
          </button>
        </div>
        
        {loading ? (
          <div className="text-center text-gray-300">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-300">
            <p className="mb-4">You haven't created any projects yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div key={project.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-2">{project.title}</h2>
                  <p className="text-gray-400 text-sm mb-4">Category: {project.category}</p>
                  <p className="text-gray-300 mb-4 h-20 overflow-hidden">
                    {project.description.length > 100 
                      ? `${project.description.substring(0, 100)}...` 
                      : project.description}
                  </p>
                  <button
                    onClick={() => router.push(`/projects/${project.id}`)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition w-full"
                  >
                    View Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newProject.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={newProject.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="comics">Comics</option>
                  <option value="animation">Animation</option>
                  <option value="novel">Novel</option>
                  <option value="script">Script</option>
                  <option value="ai">AI</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newProject.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}

// frontend/pages/projects/[id].js
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import { fetchProjectById, createPost, fetchPostsByProject } from '../../services/api'

export default function ProjectDetail() {
  const [project, setProject] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    content_type: 'document',
    file: null
  })
  const router = useRouter()
  const { id } = router.query
  const { user, token } = useAuth()

  useEffect(() => {
    const loadProjectData = async () => {
      if (!id) return
      
      try {
        const projectData = await fetchProjectById(id, token)
        setProject(projectData)
        
        const postsData = await fetchPostsByProject(id, token)
        setPosts(postsData)
      } catch (error) {
        console.error('Failed to fetch project data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (token && id) {
      loadProjectData()
    }
  }, [id, token])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewPost(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setNewPost(prev => ({ ...prev, file: e.target.files[0] }))
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('title', newPost.title)
      formData.append('content', newPost.content)
      formData.append('content_type', newPost.content_type)
      formData.append('project_id', id)
      
      if (newPost.file) {
        formData.append('file', newPost.file)
      }
      
      const createdPost = await createPost(formData, token)
      setPosts(prev => [...prev, createdPost])
      setShowModal(false)
      setNewPost({
        title: '',
        content: '',
        content_type: 'document',
        file: null
      })
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <Layout>
      <Head>
        <title>{project ? `${project.title} | Patch-Project` : 'Project Detail'}</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center text-gray-300">Loading project details...</div>
        ) : project ? (
          <>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Add Content
                </button>
              </div>
              <p className="text-gray-400 text-sm mb-4">Category: {project.category}</p>
              <p className="text-gray-300">{project.description}</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Project Content</h2>
              
              {posts.length === 0 ? (
                <div className="text-center text-gray-300 py-8">
                  <p className="mb-4">No content has been added to this project yet.</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                  >
                    Add Your First Content
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map(post => (
                    <div key={post.id} className="bg-gray-700 rounded-lg p-4">
                      <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">Type: {post.content_type}</p>
                      
                      {post.content_type === 'document' && (
                        <div className="bg-gray-800 p-4 rounded mt-3">
                          <p className="text-gray-300 whitespace-pre-line">{post.content}</p>
                        </div>
                      )}
                      
                      {post.content_type === 'image' && post.media_url && (
                        <div className="mt-3">
                          <img 
                            src={post.media_url} 
                            alt={post.title} 
                            className="max-w-full h-auto rounded"
                          />
                        </div>
                      )}
                      
                      {post.content_type === 'video' && post.media_url && (
                        <div className="mt-3">
                          <video 
                            controls 
                            src={post.media_url} 
                            className="max-w-full h-auto rounded"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-red-500">Project not found</div>
        )}
      </div>

      {/* Create Post Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Add Project Content</h2>
            <form onSubmit={handleCreatePost}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="content_type" className="block text-sm font-medium text-gray-300 mb-1">
                  Content Type
                </label>
                <select
                  id="content_type"
                  name="content_type"
                  value={newPost.content_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="document">Document</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              
              {newPost.content_type === 'document' ? (
                <div className="mb-6">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={newPost.content}
                    onChange={handleInputChange}
                    required
                    rows="8"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>
              ) : (
                <div className="mb-6">
                  <label htmlFor="file" className="block text-sm font-medium text-gray-300 mb-1">
                    {newPost.content_type === 'image' ? 'Upload Image' : 'Upload Video'}
                  </label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={handleFileChange}
                    required
                    accept={newPost.content_type === 'image' ? 'image/*' : 'video/*'}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="mt-2 text-sm text-gray-400">
                    {newPost.content_type === 'image' 
                      ? 'Supported formats: JPG, PNG, GIF' 
                      : 'Supported formats: MP4, WebM, Ogg'}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Add Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}




