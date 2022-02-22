import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import userService from "../service/user.service";
import { toast } from "react-toastify";

const UserContenxt = React.createContext();

export const useUser = () => {
    return useContext(UserContenxt);
};

const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        if (error !== null) {
            toast(error);
            setError(null);
        }
    }, [error]);

    const getUsers = async () => {
        try {
            const { content } = await userService.get();
            setUsers(content);
            setIsLoading(false);
        } catch (error) {
            errorCatcher(error);
        }
    };
    const errorCatcher = (error) => {
        const { message } = error.response.data;
        setError(message);
        setIsLoading(false);
    };
    return (
        <UserContenxt.Provider value={{ users }}>
            {!isLoading ? children : "Loading..."}
        </UserContenxt.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default UserProvider;
