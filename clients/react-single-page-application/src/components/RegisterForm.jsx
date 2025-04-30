export const RegisterForm = ({
    setPage,
    onSubmit,
}) => 
<>
  <h2>Register</h2>
    <label htmlFor="username">Username:</label>
    <input type="text" id="username" required /><br/><br/>
    
    <label htmlFor="password">Password:</label>
    <input type="password" id="password" required /><br/><br/>
    
    <label htmlFor="password2">Re-type Password:</label>
    <input type="password" id="password2" required /><br/><br/>

    <button onClick={onSubmit}>Submit</button>

    <br></br>
    <br></br>
    <button onClick={() => setPage("Login")}>Login</button>
</>
