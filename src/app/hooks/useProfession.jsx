import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import professionService from "../service/professions.service";
import { toast } from "react-toastify";

const ProfessionContenxt = React.createContext();

export const useProfession = () => {
    return useContext(ProfessionContenxt);
};

export const ProfessionProvider = ({ children }) => {
    const [professions, setProfession] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        getProfessionList();
    }, []);

    useEffect(() => {
        if (error !== null) {
            toast(error);
            setError(null);
        }
    }, [error]);

    const getProfession = (id) => {
        return professions.find((p) => p._id === id);
    };

    const getProfessionList = async () => {
        try {
            const { content } = await professionService.get();
            setProfession(content);
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
        <ProfessionContenxt.Provider
            value={{ professions, isLoading, getProfession }}
        >
            {children}
        </ProfessionContenxt.Provider>
    );
};

ProfessionProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
