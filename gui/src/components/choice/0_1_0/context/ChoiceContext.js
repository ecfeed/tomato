import { createContext } from "react";

const ChoiceContext = createContext();

function ChoiceProvider({ children }) {

    return (
        <ChoiceContext.Provider>
            {children}
        </ChoiceContext.Provider>
    )
}