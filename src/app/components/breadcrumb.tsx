'use client';

import { 
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
} from "@chakra-ui/react";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface BreadcrumbProps {
    homeElement: ReactNode;
    separator: ReactNode;
    containerClasses?: string;
    listClasses?: string;
    activeClasses?: string;
    capitalizeLinks?: boolean;
}

const BreadcrumbComponent = ({ homeElement, separator, containerClasses, listClasses, activeClasses, capitalizeLinks }: BreadcrumbProps) => {

    const paths = usePathname();
    const pathNames = paths.split('/').filter((path) => path !== '');

    return (
        <Breadcrumb>
            <BreadcrumbItem className={containerClasses}>
                <BreadcrumbLink as={Link} href={'/'} className={listClasses}>
                    {homeElement}
                </BreadcrumbLink>
                {pathNames.length > 0 && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
                {
                    pathNames.map((link, index) => {
                        const href = `/${pathNames.slice(0, index + 1).join('/')}`;
                        const itemClasses = paths === href ? `${listClasses} ${activeClasses}` : listClasses;
                        const itemLink = capitalizeLinks ? link[0].toUpperCase() + link.slice(1, link.length) : link;
                        return (
                            <BreadcrumbItem key={index} className={containerClasses}>
                                <BreadcrumbLink as={Link} href={href} className={itemClasses}>
                                    {itemLink}
                                </BreadcrumbLink>
                                {index < pathNames.length - 1 && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
                            </BreadcrumbItem>
                        );
                    })
                }
            </BreadcrumbItem>
        </Breadcrumb>
    );
}

export default BreadcrumbComponent;