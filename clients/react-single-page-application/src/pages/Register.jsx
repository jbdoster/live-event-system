import { RegisterForm } from "../components";

import { useContext } from "react"

import { Identity } from "../contexts"

const register = async (
    setAccessToken,
    setRefreshToken,
) => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;

    const params = new URLSearchParams();
    params.append('username', username)
    params.append('password', password)
    params.append('password2', password2)

    const response = await fetch(import.meta.env.VITE_IDENTITY_SERVICE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
    })
    .catch(error => {
        console.log(error)
        alert("Register failed: " + error.message)
    })

    if (!response) {
        return;
    }

    if (!response.ok) {
        alert('Register failed.');
        throw new Error(`Register failed: ${response.statusText}`);
    }

    const data = await response.json()
    .catch(
        error => {
            console.error(error)
            alert('Register failed.');
        }
    );

    setAccessToken(data.access_token)
    setRefreshToken(data.refresh_token)
    alert('Register successful!');
    console.log('Access Token:', data.access_token);
}

export const Register = ({
    setPage,
}) => {
    const {
        setAccessToken,
        setRefreshToken,
    } = useContext(Identity.Context);

    return <RegisterForm
        setPage={setPage}
        onSubmit={() => register(
            setAccessToken,
            setRefreshToken,
        )}
    />
}
