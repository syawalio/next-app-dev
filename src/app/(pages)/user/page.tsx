'use client';

import { useState, useEffect, useMemo } from "react";
import SidebarWithHeader from "@/app/components/sidebar";
import BreadcrumbComponent from "@/app/components/breadcrumb";
import { UserData, fakeDataUser, intValueUser } from "@/app/types/userInterface";
import { TableContent, TableControllContent } from "@/app/components/tableContent";
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
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Swal from 'sweetalert2';

function UserPage() {
    const homeElement = <Text>User</Text>;
    const separator = <Text>/</Text>;

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

    const [dataUsers, setDataUsers] = useState<UserData[]>([]);
    const [totalData, setTotalData] = useState<number>(0);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    useEffect(() => {
        setDataUsers(fakeDataUser);
        setTotalData(fakeDataUser.length);
    }, []);

    const FormSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        role: Yup.string().required('Role is required'),
    });

    const handleSubmit = (values: UserData, { resetForm }: any) => {
        setDataUsers([...dataUsers, values]);
        setTotalData(totalData + 1);
        resetForm();
        onClose();
        Swal.fire({
            title: 'Success!',
            text: 'User added successfully',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        console.log('User added:', values);
    };

    const handleDetail = (values : UserData) => {
        setSelectedUser(values);
        onEditOpen();
        };
        

    const handleUpdate = (values: UserData, { resetForm }: any) => {
        setDataUsers(dataUsers.map(user => user.username === values.username ? values : user));
        resetForm();
        onEditClose();
        Swal.fire({
            title: 'Success!',
            text: 'User updated successfully',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        console.log('User updated:', values);
    };

    const handleDelete = (username: string) => {
        console.log('Before deletion:', dataUsers);
        console.log('Username to delete:', username);
        setDataUsers((prevDataUsers) => prevDataUsers.filter(user => user.username !== username));
        // setDataUsers(dataUsers.filter(user => user.username !== username));
        
        // console.log('Updated users:', updatedUsers);
        setTotalData(dataUsers.length);
        
        Swal.fire({
            title: 'Deleted!',
            text: 'User deleted successfully',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        
        // console.log('After deletion:', updatedUsers);
        console.log('User deleted:', username);
    };

    const handleEdit = (user: UserData) => {
        setSelectedUser(user);
        onEditOpen();
    };

    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5, 
    });

    const pagination = useMemo(() => {
        return {
            pageIndex,
            pageSize,
        };
    }, [pageIndex, pageSize]);

    const columns = useMemo<ColumnDef<UserData>[]>(() => [
        {
            accessorFn: (row: UserData) => row.username,
            id: 'username',
            cell: (info) => info.getValue(),
            header: () => <Text fontWeight={600}>Username</Text>,
            footer: (props) => props.column.id,
        },
        {
            accessorFn: (row: UserData) => row.name,
            id: 'name',
            cell: (info) => info.getValue(),
            header: () => <Text fontWeight={600}>Name</Text>,
            footer: (props) => props.column.id,
        },
        {
            accessorFn: (row: UserData) => row.email,
            id: 'email',
            cell: (info) => info.getValue(),
            header: () => <Text fontWeight={600}>Email</Text>,
            footer: (props) => props.column.id,
        },
        {
            accessorFn: (row: UserData) => row.role,
            id: 'role',
            cell: (info) => info.getValue(),
            header: () => <Text fontWeight={600}>Role</Text>,
            footer: (props) => props.column.id,
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <HStack spacing={2}>
                    <Button size="sm" colorScheme="blue" onClick={() => handleDetail(row.original)}>Detail</Button>
                    <Button size="sm" colorScheme="blue" onClick={() => handleEdit(row.original)}>Edit</Button>
                    <Button size="sm" colorScheme="red" onClick={() => handleDelete(row.original.username)}>Delete</Button>
                </HStack>
            ),
            header: () => <Text fontWeight={600}>Actions</Text>,
        },
    ], []);

    const table = useReactTable({
        data: dataUsers,
        columns: columns,
        pageCount: Math.ceil(totalData / pageSize),
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualFiltering: true,
        manualPagination: false,
    });

    return (
        <SidebarWithHeader >
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
                    <Button colorScheme="blue" onClick={onOpen}>Add User</Button>
                </Flex>
                
                <TableContent table={table} />
                <TableControllContent table={table} />
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Formik
                            initialValues={{
                                username: '',
                                name: '',
                                email: '',
                                role: ''
                            }}
                            validationSchema={FormSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ errors, touched }) => (
                                <Form>
                                    <FormControl id="username" isInvalid={!!errors.username && touched.username} isRequired>
                                        <FormLabel>Username</FormLabel>
                                        <Field name="username" as={Input} />
                                        <Text color="red.500"><ErrorMessage name="username" component="div" /></Text>
                                    </FormControl>
                                    <FormControl id="name" isInvalid={!!errors.name && touched.name} isRequired mt={4}>
                                        <FormLabel>Name</FormLabel>
                                        <Field name="name" as={Input} />
                                        <Text color="red.500"><ErrorMessage name="name" component="div" /></Text>
                                    </FormControl>
                                    <FormControl id="email" isInvalid={!!errors.email && touched.email} isRequired mt={4}>
                                        <FormLabel>Email</FormLabel>
                                        <Field name="email" as={Input} />
                                        <Text color="red.500"><ErrorMessage name="email" component="div" /></Text>
                                    </FormControl>
                                    <FormControl id="role" isInvalid={!!errors.role && touched.role} isRequired mt={4}>
                                        <FormLabel>Role</FormLabel>
                                        <Field name="role" as={Input} />
                                        <Text color="red.500"><ErrorMessage name="role" component="div" /></Text>
                                    </FormControl>
                                    <ModalFooter>
                                        <Button type="submit" colorScheme="blue">Save</Button>
                                        <Button variant='ghost' onClick={onClose}>Cancel</Button>
                                    </ModalFooter>
                                </Form>
                            )}
                        </Formik>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Modal isOpen={isEditOpen} onClose={onEditClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Formik
                            initialValues={selectedUser || {
                                username: '',
                                name: '',
                                email: '',
                                role: ''
                            }}
                            validationSchema={FormSchema}
                            onSubmit={handleUpdate}
                            enableReinitialize
                        >
                            {({ errors, touched }) => (
                                <Form>
                                    <FormControl id="username" isInvalid={!!errors.username && touched.username} isRequired>
                                        <FormLabel>Username</FormLabel>
                                        <Field name="username" as={Input} />
                                        <Text color="red.500"><ErrorMessage name="username" component="div" /></Text>
                                    </FormControl>
                                    <FormControl id="name" isInvalid={!!errors.name && touched.name} isRequired mt={4}>
                                        <FormLabel>Name</FormLabel>
                                        <Field name="name" as={Input} />
                                        <Text color="red.500"><ErrorMessage name="name" component="div" /></Text>
                                    </FormControl>
                                    <FormControl id="email" isInvalid={!!errors.email && touched.email} isRequired mt={4}>
                                        <FormLabel>Email</FormLabel>
                                        <Field name="email" as={Input} />
                                        <Text color="red.500"><ErrorMessage name="email" component="div" /></Text>
                                    </FormControl>
                                    <FormControl id="role" isInvalid={!!errors.role && touched.role} isRequired mt={4}>
                                        <FormLabel>Role</FormLabel>
                                        <Field name="role" as={Input} />
                                        <Text color="red.500"><ErrorMessage name="role" component="div" /></Text>
                                    </FormControl>
                                    <ModalFooter>
                                        <Button type="submit" colorScheme="blue">Update</Button>
                                        <Button variant='ghost' onClick={onEditClose}>Cancel</Button>
                                    </ModalFooter>
                                </Form>
                            )}
                        </Formik>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </SidebarWithHeader>
    );
}

export default UserPage;