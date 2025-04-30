import { useContext, useState } from "react"

import * as contexts from "./contexts";
import * as Pages from "./pages"

export const App = () => {
  const {
    accessToken,
  } = useContext(contexts.Identity.Context);

  const [page, setPage] = useState("Login")

  if (accessToken) {
    return <Pages.Authenticated />
  }
  else if (page === "Login") {
    return <Pages.Login
      setPage={setPage}
    />
  }
  else if (page === "Register") {
    return <Pages.Register
      setPage={setPage}
    />
  }

  return <Pages.Login
    setPage={setPage}
  />
}
