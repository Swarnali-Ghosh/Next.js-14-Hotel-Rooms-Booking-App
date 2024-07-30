import React from 'react'
import { ConfigProvider } from "antd";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <ConfigProvider
                theme={{
                    token: {   // If you want to change something in the global level across the application, you have to use the token 
                        colorPrimary: '#000',
                        borderRadius: 1
                    },
                    components: { // If you want to change anything for specific component, you have to use the components property. 
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