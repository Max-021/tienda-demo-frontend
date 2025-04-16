import { createTheme } from "@mui/material";

const theme = createTheme({
    components:{
        MuiFormControl: {
            styleOverrides:{
                root:{
                    minWidth: '0 !important',
                    width:'100% !important',
                }
            }
        },
        MuiTextField:{
            styleOverrides:{
                root:{

                }
            }
        }
    }
})

export default theme;