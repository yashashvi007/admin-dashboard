export default function LoginPage() {
  return (
    <div>
      <h1>Sign in</h1>
      <input type="text" placeholder="Username" />
      <input type="text"  placeholder="Password" />
      <button>Log in</button>
      <label htmlFor="remember-me">Remember me</label>
      <input type="checkbox" id="remember-me" />
    </div>
  )
}
