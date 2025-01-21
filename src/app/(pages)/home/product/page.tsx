'use client';

import SidebarWithHeader from "@/app/components/sidebar";
import BreadcrumbComponent from "@/app/components/breadcrumb";
import Simple from "@/app/components/productdetail";

import { 
    Box,
    Text,
} from "@chakra-ui/react"; 

import { usePathname } from "next/navigation";

function productPage() {
    const pathname = usePathname();
    const homeElement = <Text>Home</Text>;
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
                <Simple />
            </Box>
        </SidebarWithHeader>
    );
}
export default productPage;