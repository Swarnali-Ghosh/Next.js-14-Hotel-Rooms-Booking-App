"use client"
import React, { useState } from 'react'
import Header from './header'
import { UserType } from "@/interfaces";
import { GetCurrentUserFromMongoDB } from "@/server-actions/users";
import { message } from "antd";
import { usePathname } from 'next/navigation';
import Spinner from '@/components/spinner';

const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [loggedInUserData, setLoggedInUserData] =
        React.useState<UserType | null>(null);

    const pathname = usePathname()
    const isAuthRoute = pathname.includes("/sign-in") || pathname.includes("/sign-up");

    const [loading, setLoading] = React.useState(true);

    const getUserData = async () => {
        try {
            setLoading(true);
            const response = await GetCurrentUserFromMongoDB();
            if (response.success) {
                setLoggedInUserData(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (!loggedInUserData && !isAuthRoute) {
            getUserData();
        }
    }, []);

    if (isAuthRoute) {
        return children;
    }

    if (loading) {
        return <Spinner fullHeight />
    }

    return (
        <div>
            <Header loggedInUserData={loggedInUserData} />
            <div className='lg:px-20 mt-5'>
                {children}
            </div>
        </div>
    )
}

export default LayoutProvider