'use client'; 

import { useState, useEffect, useMemo } from 'react';
import SidebarWithHeader from '@/app/components/sidebar';
import BreadcrumbComponent from '@/app/components/breadcrumb';
import { UsersData } from '@/app/types/usersInterface';
import { TableContent, TableControllContent } from '@/app/components/tableContent';
import {
    useReactTable,
    PaginationState,
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table'

import {
    Box,
    Button,
    Flex,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    HStack,
} from "@chakra-ui/react";
// import Swal from 'sweetalert2';

function UsersPage() {

    const homeElement = <Text>Users Profile</Text>;
    const separator = <Text>/</Text>;

    const columns: ColumnDef<UsersData>[] = useMemo(() => [
        {
            header: 'ID',
            accessorKey: 'id',
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'First Name',
            accessorKey: 'first_name',
        },
        {
            header: 'Last Name',
            accessorKey: 'last_name',
        },
        {
            header: 'Avatar',
            accessorKey: 'avatar',
            cell: info => <img src={info.getValue() as string} alt="avatar" width={50} height={50} />,
        },
    ], []);

    const [data, setData] = useState<UsersData[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 6,
    });
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responses = await Promise.all([
                    fetch('https://reqres.in/api/users?page=1').then(res => res.json()),
                    fetch('https://reqres.in/api/users?page=2').then(res => res.json()) 
                ]);
                const allData = responses.flatMap(response => response.data);
                setData(allData);
                setTotalPages(responses[0].total_pages);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const table = useReactTable({
        data,
        columns,
        state: {
            pagination,
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
    });

    return (
        <SidebarWithHeader>
            <BreadcrumbComponent
                homeElement={homeElement}
                separator={separator}
                containerClasses="breadcrumb-container"
                listClasses="breadcrumb-list"
                activeClasses="breadcrumb-active"
                capitalizeLinks={true}
            />

            <Box my={4} p={6} w={"100%"} borderRadius={8} bgColor={"white"}>
                <Flex justifyContent="space-between" alignItems="center" marginBottom={4}>
                    <Heading as="h1" size="md" marginBottom={4}>User Page</Heading>
                </Flex>
                
                <TableContent table={table} />
                <TableControllContent table={table} />
                {/* <Text>Total Pages: {totalPages}</Text> */}
            </Box>

        </SidebarWithHeader>
    );
}

export default UsersPage;