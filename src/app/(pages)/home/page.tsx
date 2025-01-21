'use client';

import SidebarWithHeader from "@/app/components/sidebar";
import BreadcrumbComponent from "@/app/components/breadcrumb";
import BasicStatistics from "@/app/components/statistics";
import productPage from "./product/page";
import { 
    Box,
    Button,
    Text,
    Input,
    FormControl,
    FormLabel,
    FormHelperText,
    Card,
    CardHeader,
    CardFooter,
    CardBody,
} from "@chakra-ui/react"; 
import Link from 'next/link';
import { usePathname } from "next/navigation";

function homePage() {
    const pathname = usePathname();
    const homeElement = <Text>Home </Text>;
    const separator = <Text> / </Text>;

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
            <Box 
                p={4}
                minH={"100vh"}
                w={"100%"}
                gap={4}>

                <BasicStatistics />
                
                <Box mt={4}>
                    <Link href="/home/product">
                        <Button colorScheme="teal">Go to Another View</Button>
                    </Link>
                </Box>
            </Box>
        </SidebarWithHeader>
    );
}
export default homePage;