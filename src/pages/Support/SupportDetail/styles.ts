import {makeStyles} from "@material-ui/core";
import {createStyles} from "@material-ui/core/styles";

export default makeStyles(theme =>
    createStyles({
        paper: {
            width: '100vw',
            height: '100vh',
            // maxWidth: '1000px',
            // maxHeight: '1400px',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            position: 'relative'
        },
        container: {
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        messagesBody: {
            width: 'calc( 100% - 20px )',
            margin: 10,
            backgroundColor: "rgb(113, 147, 193)",
            // overflowX: 'hidden',
            overflowY: 'scroll',
            height: 'calc( 100% - 80px )'
        },
    })
);

