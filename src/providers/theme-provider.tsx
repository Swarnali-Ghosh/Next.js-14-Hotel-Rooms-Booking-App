import React from 'react'
import { ConfigProvider } from "antd";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#000',
                        borderRadius: 1
                    },
                    components: {
                        Button: {
                            controlHeight: 42,
                            defaultBorderColor: '#000'
                        },
                        Input: {
                            controlHeight: 42,
                            activeShadow: 'none',
                            boxShadow: 'none',
                            colorBorder: '#ccc'
                        }
                    }

                }}>
                {children}
            </ConfigProvider>
        </div>
    )
}

export default ThemeProvider