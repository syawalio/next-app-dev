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
                <BreadcrumbLink className={listClasses}>
                    <Link href={'/'}>
                        {homeElement}
                    </Link>
                </BreadcrumbLink>
                {pathNames.length > 0 && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
                {
                    pathNames.map((link, index) => {
                        const href = `/${pathNames.slice(0, index + 1).join('/')}`; // Changed to const
                        const itemClasses = paths === href ? `${listClasses} ${activeClasses}` : listClasses; // Changed to const
                        const itemLink = capitalizeLinks ? link[0].toUpperCase() + link.slice(1, link.length) : link; // Changed to const
                        return (
                            <BreadcrumbItem key={index} className={containerClasses}>
                                <BreadcrumbLink className={itemClasses}>
                                    <Link href={href}>{itemLink}</Link>
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