import { Box, styled } from "@mui/material";
import { createContext } from "react";
import Loading from "../../components/common/loading/loading";
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setLoading } from "../slices/loadingSlice";

interface LoadingContextProps {
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const LoadingContext = createContext<{
    loading: boolean;
    setLoading: (loading: boolean) => void;
}>({} as LoadingContextProps);

const StyledBox = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000000,
    transition: 'opacity 0.3s ease-in-out',
    userSelect: 'none',
    pointerEvents: 'none',
    backgroundColor: theme.palette.action.disabledBackground,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}));

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const { loading } = useAppSelector(state => state.loading);
    const dispatch = useAppDispatch();

    return (
        <LoadingContext.Provider
            value={{
                loading: loading,
                setLoading: (loading) => dispatch(setLoading(loading)),
            }}
        >
            {children}
            <StyledBox
                sx={{
                    visibility: loading ? 'visible' : 'hidden',
                    opacity: loading ? 1 : 0,
                }}
            >
                <Loading />
            </StyledBox>
        </LoadingContext.Provider>
    );
};