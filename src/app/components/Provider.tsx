'use client';

import { queryClient } from "./QueryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from '@chakra-ui/react'
import React from "react";

interface ProviderProps {
    children: React.ReactNode;
}

export default function Provider({ children }: ProviderProps) {
    return (
        <ChakraProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </ChakraProvider>
    );
}