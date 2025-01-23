import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
    Button,
    Flex,
    Heading,
    HStack,
    Table, 
    TableCaption, 
    TableContainer, 
    Tbody, 
    Td, 
    Text, 
    Th, 
    Thead, 
    Tr
} from "@chakra-ui/react";
import { flexRender } from "@tanstack/react-table";

export function TableContent({ table }: { table: any }) {
    return (
        <TableContainer border={"1px"} borderColor={"gray.200"} borderRadius={8}>
            <Table variant="striped" colorScheme="white">
                <TableCaption margin={2}>User Datatable</TableCaption>
                <Thead>
                    {table.getHeaderGroups().map((headerGroup: any, idx: number) => (
                        <Tr key={idx} bg={"primary.100"}>
                            {headerGroup.headers.map((header: any) => (
                                <Th key={header.id} colSpan={header.colSpan} color={"primary.100"}>
                                    <Heading as="h5" size="sm">
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </Heading>
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </Thead>
                <Tbody>
                    {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row: any, index: any) => (
                            <Tr key={index}>
                                {row.getVisibleCells().map((cell: any, idx: any) => (
                                    <Td key={idx}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </Td>
                                ))}
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan={table.options.columns.length + 1}>
                                <Flex justifyContent="center" alignItems="center" p={4}>
                                    <Text>No Data</Text>
                                </Flex>
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export function TableControllContent({ table, totalPages }: { table: any, totalPages: number }) {
    return (
        <Flex w={"full"} justifyContent="space-between" alignItems="center" gap={4} marginTop={4}>
            <Flex gap={2} width={"auto"} justifyContent={"start"}>
                <strong>{table.getState().pagination.pageIndex + 1}</strong>
                <strong>of</strong>
                <strong>{totalPages}</strong>
            </Flex>
            <HStack spacing={4}>
                <Button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    leftIcon={<ChevronLeftIcon />}
                >
                    Previous
                </Button>
                <Button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage() || table.getState().pagination.pageIndex + 1 >= totalPages}
                    rightIcon={<ChevronRightIcon />}
                >
                    Next
                </Button>
            </HStack>
        </Flex>
    );
};