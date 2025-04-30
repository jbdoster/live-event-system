import { LoginForm } from "../components";

import { useContext } from "react"

import { Identity } from "../contexts"

const login = async (
    setAccessToken,
    setRefreshToken,
) => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', import.meta.env.VITE_IDENTITY_PROVIDER_CLIENT_ID);
    params.append('username', username);
    params.append('password', password);

    const response = await fetch(import.meta.env.VITE_IDENTITY_PROVIDER_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
    })
    .catch(error => {
        console.log(error)
        alert("Login failed.")
    })

    if (!response) {
        return;
    }

    if (!response.ok) {
        alert('Login failed.');
        throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json()
    .catch(
        error => {
            console.error(error)
            alert('Login failed.');
        }
    );

    setAccessToken(data.access_token)
    setRefreshToken(data.refresh_token)
    alert('Login successful!');
    console.log('Access Token:', data.access_token);
}

export const Login = ({
    setPage,
}) => {
    const {
        setAccessToken,
        setRefreshToken,
    } = useContext(Identity.Context);

    return <LoginForm
        setPage={setPage}
        onSubmit={() => login(
            setAccessToken,
            setRefreshToken,
        )}
    />
}
