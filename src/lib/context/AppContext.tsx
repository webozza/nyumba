import * as React from 'react'
import ICurrentUser from '../interfaces/User.interface'

interface Props {
  children?: React.ReactNode
}

export type AppContextType = {
  user: ICurrentUser | undefined
  setUser: React.Dispatch<any>
}

const initialState = {
  user: undefined,
  setUser: () => { return },
}

export const AppContext = React.createContext<AppContextType>(initialState)

const AppProvider = ({ children }: Props) => {
  const [user, setUser] = React.useState<any | null>(null)

  return (
    <AppContext.Provider value={{
      user,
      setUser,
    }}>
      {children}
    </AppContext.Provider>
  );
}


export function useAppContext() {
  return React.useContext(AppContext);
}

export default AppProvider