import {Theme} from "@mui/material/styles";

export default {
    wrapper: {
        display: "flex",
        backgroundColor: "background.paper",
        alignItems: "center",
        padding: 0.5,
        borderRadius: 1
    },
    input: {
        border: "none",
        textAlign: "left",
        width: "100%",
        fontSize: 14,
        padding: 0.5,
        "&::placeholder": {
            color: (theme: Theme) => theme.palette.grey["400"]
        }
    },
    actionButton: {
        "&:hover": {
            color:  "primary.main"
        }
    }
}