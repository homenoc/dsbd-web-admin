import React, {Dispatch, SetStateAction, useState} from 'react'
import TextField from '@material-ui/core/TextField';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        wrapForm: {
            display: "flex",
            justifyContent: "center",
            width: "95%",
            margin: `${theme.spacing(0)} auto`,
            height: "150px"
        },
        wrapText: {
            width: "100%"
        },
        button: {
            //margin: theme.spacing(1),
        },
    })
);

export const TextInput = (props: {
    inputChat: string
    setInputChat: Dispatch<SetStateAction<string>>
    setSendPush: Dispatch<SetStateAction<boolean>>
}) => {
    const classes = useStyles();
    const {inputChat, setInputChat, setSendPush} = props

    return (
        <>
            <form className={classes.wrapForm} noValidate autoComplete="off">
                <TextField
                    id="standard-text"
                    label="メッセージを入力"
                    className={classes.wrapText}
                    value={inputChat}
                    //margin="normal"
                    multiline
                    rows={5}
                    onChange={event => {
                        setInputChat(event.target.value);
                    }}
                />
                <Button variant="contained" color="primary" className={classes.button}
                        onClick={() => setSendPush(true)}>
                    <SendIcon/>
                </Button>
            </form>
        </>
    )
}
