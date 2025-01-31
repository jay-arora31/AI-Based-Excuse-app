// App.jsx
import { useState } from 'react'
import './App.css'

function App() {
  const [situation, setSituation] = useState('')
  const [excuse, setExcuse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateExcuse = async (e) => {
    console.log(JSON.stringify({ situation }))
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8000/api/generate-excuse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ situation }),
      })

      if (!response.ok) {
        console.log("Failed to connect with backend")
        throw new Error('Failed to generate excuse')
      }

      const data = await response.json()
      setExcuse(data.excuse)
    } catch (err) {
      setError('Failed to generate excuse. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>AI Excuse Generator</h1>
      <form onSubmit={generateExcuse}>
        <div className="input-group">
          <label htmlFor="situation">Describe your situation:</label>
          <textarea
            id="situation"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="e.g., I'm late for work..."
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Excuse'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      
      {excuse && (
        <div className="result">
          <h2>Your Excuse:</h2>
          <p>{excuse}</p>
        </div>
      )}
    </div>
  )
}

export default App