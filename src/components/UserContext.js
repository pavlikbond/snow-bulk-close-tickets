import { useState, useContext, createContext, useEffect } from "react";
import { Auth } from "aws-amplify";
const UserContext = createContext();

export function useUserRole() {
    return useContext(UserContext);
}

export function UserProvider({ children }) {
    const [role, setRole] = useState("");

    useEffect(() => {
        Auth.currentUserInfo()
            .then((result) => {
                let role = result.attributes.profile;
                //let email = result.attributes.email;
                //console.log("user:", result.attributes.profile);
                setRole(role || "");
            })
            .catch((err) => {});
    }, []);

    return <UserContext.Provider value={role}>{children}</UserContext.Provider>;
}
