import { useContext } from "react"

import * as contexts from "./contexts";
import * as Pages from "./pages"

export const App = () => {
  const {
    storageContext,
  } = useContext(contexts.Storage.Context);

  return storageContext?.sessionId
    ?
    <Pages.Authenticated />
    :
    <Pages.Unauthenticated />
}
