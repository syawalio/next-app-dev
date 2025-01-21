'use client';

import SidebarWithHeader from "@/app/components/sidebar";
import BreadcrumbComponent from "@/app/components/breadcrumb";
import { 
  Box,
  Text,
} from "@chakra-ui/react";
import { usePathname } from "next/navigation";

function settingPage() {
  const pathname = usePathname();
      const homeElement = <Text>Setting</Text>;
      const separator = <Text>/</Text>;

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
        >
          
        <h1>Settings</h1>
      </Box>
    </SidebarWithHeader>
  );
}
export default settingPage;