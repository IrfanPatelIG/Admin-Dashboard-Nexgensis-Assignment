import { useState } from 'react'
import { loginUser } from '../api/authApi'
import { useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate()
    
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setIsSubmitting(true)

        try {
            const data = await loginUser(username, password)

            localStorage.setItem("token", data.accessToken)

            navigate("/products")
        } catch (err) {
            setError("Invalid username or password")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
    <div className='w-fit flex flex-col gap-6 items-center justify-center mt-40 mx-auto p-3 border rounded'>
        <h1 className='font-bold text-2xl'>Login</h1>

        <form onSubmit={handleSubmit} 
        className='flex flex-col gap-3 w-full items-center *:flex *:gap-3 *:justify-center'>
            <div className='input-parent'>
                <label className='flex-1'>Username:</label>
                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Enter username'
                className='border-b'/>
            </div>

            <div className='input-parent'>
                <label className='flex-1'>Password:</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter password'
                className='border-b'/>
            </div>

            <p className={`opcaity-0 py-3 mt-3 text-red-700 ${error && "opacity-100 p-0!"}`}>{error}</p>

            <button className='btn-primary mt-3'
             type="submit" disabled={isSubmitting}>{isSubmitting? "Logging in..." : "Login"}</button>
        </form>
    </div>
    )
}

export default Login