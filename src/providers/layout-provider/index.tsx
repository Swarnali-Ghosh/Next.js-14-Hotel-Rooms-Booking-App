"use client"
import React from 'react'
import Header from './header'
import { UserType } from "@/interfaces";
import { GetCurrentUserFromMongoDB } from "@/server-actions/users";
import { message } from "antd";

const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [loggedInUserData, setLoggedInUserData] =
        React.useState<UserType | null>(null);

    const getUserData = async () => {
        try {
            // setLoading(true);
            const response = await GetCurrentUserFromMongoDB();
            if (response.success) {
                setLoggedInUserData(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (error: any) {
            message.error(error.message);
        } finally {
            // setLoading(false);
        }
    };

    React.useEffect(() => {
        if (!loggedInUserData) {
            getUserData();
        }
    }, []);
    return (
        <div>
            <Header loggedInUserData={loggedInUserData} />
            {children}
        </div>
    )
}

export default LayoutProvider