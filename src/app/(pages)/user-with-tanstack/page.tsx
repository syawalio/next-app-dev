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
} from '@tanstack/react-table';
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
    FocusLock,
    Image,
} from "@chakra-ui/react";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { fetchUsers, getUserById, createUser, updateUser, deleteUser, queryClient } from '@/app/services/User';

function UsersPage() {
    const homeElement = <Text>Users Profile</Text>;
    const separator = <Text>/</Text>;

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();

    const [selectedUser, setSelectedUser] = useState<UsersData | null>(null);
    const [viewUser, setViewUser] = useState<UsersData | null>(null);
    const [data, setData] = useState<UsersData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [totalPages, setTotalPages] = useState(0);

    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 6,
    });

    useEffect(() => {
        const loadUsers = async () => {
            setIsLoading(true);
            try {
                const response = await fetchUsers(pageIndex + 1, pageSize);
                setData(response.data);
                setTotalPages(response.total_pages);
            } catch (error) {
                setError(error as Error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUsers();
    }, [pageIndex, pageSize]);

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
            cell: info => <Text onClick={() => handleView(info.row.original.id)} cursor="pointer" color="blue.500">{String(info.getValue())}</Text>,
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
        {
            id: 'actions',
            cell: ({ row }) => (
                <HStack spacing={2}>
                    <Button size="sm" colorScheme="blue" onClick={() => handleEdit(row.original)}>Edit</Button>
                    <Button size="sm" colorScheme="red" onClick={() => handleDelete(row.original.id)}>Delete</Button>
                </HStack>
            ),
            header: () => <Text fontWeight={600}>Actions</Text>,
        },
    ], []);

    const pagination = useMemo(() => {
        return {
            pageIndex,
            pageSize,
        };
    }, [pageIndex, pageSize]);

    const table = useReactTable({
        data,
        columns,
        state: {
            pagination,
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        manualPagination: true,
        pageCount: totalPages,
    });

    const FormSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        job: Yup.string().required('Job is required'),
    });

    const handleSubmit = async (values: { name: string; job: string }, { resetForm }: any) => {
        try {
            await createUser(values);
            queryClient.invalidateQueries({ queryKey: ['users'] });
            resetForm();
            onClose();
            Swal.fire({
                title: 'Success!',
                text: 'User added successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: (error as Error).message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleGetUserById = async (id: number) => {
        try {
            const user = await getUserById(id);
            setViewUser(user.data);
            onViewOpen();
        } catch (error) {
            console.error('Error fetching user by ID:', error);
        }
    };

    const handleView = (id: number) => {
        handleGetUserById(id);
    };

    const handleEdit = (user: UsersData) => {
        setSelectedUser(user);
        onEditOpen();
    };

    const handleUpdate = async (values: { name: string; job: string }, { resetForm }: any) => {
        if (selectedUser) {
            try {
                await updateUser(selectedUser.id, values);
                queryClient.invalidateQueries({ queryKey: ['users'] });
                resetForm();
                onEditClose();
                Swal.fire({
                    title: 'Success!',
                    text: 'User updated successfully',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: (error as Error).message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteUser(id);
            queryClient.invalidateQueries({ queryKey: ['users'] });
            Swal.fire({
                title: 'Deleted!',
                text: 'User deleted successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: (error as Error).message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

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
                    <Button colorScheme="blue" onClick={onOpen}>Add User</Button>
                </Flex>

                {isLoading ? (
                    <Text>Loading...</Text>
                ) : error ? (
                    <Text>Error: {error.message}</Text>
                ) : (
                    <>
                        <TableContent table={table} />
                        <TableControllContent table={table} totalPages={totalPages} />
                    </>
                )}
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <FocusLock>
                        <ModalHeader>Add User</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Formik
                                initialValues={{
                                    name: '',
                                    job: ''
                                }}
                                validationSchema={FormSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ errors, touched }) => (
                                    <Form>
                                        <FormControl id="name" isInvalid={!!errors.name && touched.name} isRequired>
                                            <FormLabel>Name</FormLabel>
                                            <Field name="name" as={Input} />
                                            <Text color="red.500"><ErrorMessage name="name" component="div" /></Text>
                                        </FormControl>
                                        <FormControl id="job" isInvalid={!!errors.job && touched.job} isRequired mt={4}>
                                            <FormLabel>Job</FormLabel>
                                            <Field name="job" as={Input} />
                                            <Text color="red.500"><ErrorMessage name="job" component="div" /></Text>
                                        </FormControl>
                                        <ModalFooter>
                                            <Button type="submit" colorScheme="blue">Save</Button>
                                            <Button variant='ghost' onClick={onClose}>Cancel</Button>
                                        </ModalFooter>
                                    </Form>
                                )}
                            </Formik>
                        </ModalBody>
                    </FocusLock>
                </ModalContent>
            </Modal>

            <Modal isOpen={isEditOpen} onClose={onEditClose}>
                <ModalOverlay />
                <ModalContent>
                    <FocusLock>
                        <ModalHeader>Edit User</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Formik
                                initialValues={selectedUser ? { name: selectedUser.first_name, job: '' } : { name: '', job: '' }}
                                validationSchema={FormSchema}
                                onSubmit={handleUpdate}
                                enableReinitialize
                            >
                                {({ errors, touched }) => (
                                    <Form>
                                        <FormControl id="name" isInvalid={!!errors.name && touched.name} isRequired>
                                            <FormLabel>Name</FormLabel>
                                            <Field name="name" as={Input} />
                                            <Text color="red.500"><ErrorMessage name="name" component="div" /></Text>
                                        </FormControl>
                                        <FormControl id="job" isInvalid={!!errors.job && touched.job} isRequired mt={4}>
                                            <FormLabel>Job</FormLabel>
                                            <Field name="job" as={Input} />
                                            <Text color="red.500"><ErrorMessage name="job" component="div" /></Text>
                                        </FormControl>
                                        <ModalFooter>
                                            <Button type="submit" colorScheme="blue">Update</Button>
                                            <Button variant='ghost' onClick={onEditClose}>Cancel</Button>
                                        </ModalFooter>
                                    </Form>
                                )}
                            </Formik>
                        </ModalBody>
                    </FocusLock>
                </ModalContent>
            </Modal>

            <Modal isOpen={isViewOpen} onClose={onViewClose}>
                <ModalOverlay />
                <ModalContent>
                    <FocusLock>
                        <ModalHeader>View User</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {viewUser && (
                                <Box p={4}>
                                    <Flex direction="column" align="center" gap={4}>
                                        <Image borderRadius="full" boxSize="100px" src={viewUser.avatar} alt="avatar" />
                                        <Text fontSize="lg"><strong>ID:</strong> {viewUser.id}</Text>
                                        <Text fontSize="lg"><strong>Email:</strong> {viewUser.email}</Text>
                                        <Text fontSize="lg"><strong>First Name:</strong> {viewUser.first_name}</Text>
                                        <Text fontSize="lg"><strong>Last Name:</strong> {viewUser.last_name}</Text>
                                    </Flex>
                                </Box>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button variant='ghost' onClick={onViewClose}>Close</Button>
                        </ModalFooter>
                    </FocusLock>
                </ModalContent>
            </Modal>
        </SidebarWithHeader>
    );
}

export default UsersPage;