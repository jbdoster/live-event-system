export const LoginForm = ({
    setPage,
    onSubmit,
}) => 
<>
  <h2>Login</h2>
    <label htmlFor="username">Username:</label>
    <input type="text" id="username" required /><br/><br/>
    
    <label htmlFor="password">Password:</label>
    <input type="password" id="password" required /><br/><br/>
    
    <button onClick={onSubmit}>Submit</button>

    <br></br>
    <br></br>
    <button onClick={() => setPage("Register")}>Register</button>
</>
