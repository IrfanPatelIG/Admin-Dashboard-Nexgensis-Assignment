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
            <div>
                <label>Uername</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Enter username'/>
            </div>

            <div>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter password'/>
            </div>

            {error && <p className='mt-3 text-red-700'>{error}</p>}

            <button className='w-[120px] mt-3 px-2 py-1 border rounded-2xl'
             type="submit" disabled={isSubmitting}>{isSubmitting? "Loggin in..." : "Login"}</button>
        </form>
    </div>
    )
}

export default Login