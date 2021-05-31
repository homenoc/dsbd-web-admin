import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide} from "@material-ui/core";
import React, {Dispatch, SetStateAction} from "react";
import {TransitionProps} from "@material-ui/core/transitions";
import {JPNICData} from "../../../interface";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export function DeleteAlertDialog(props: {
    setDeleteProcess: Dispatch<SetStateAction<boolean>>
}) {
    const {setDeleteProcess} = props
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (result: boolean) => {
        if (result) {
            setDeleteProcess(true)
        }
        setOpen(false);
    };

    return (
        <div>
            <Button size="small" variant="outlined" color={"secondary"} onClick={handleClickOpen}>Delete</Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">削除</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        本当に削除しますか？
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(false)} color="primary">
                        いいえ
                    </Button>
                    <Button onClick={() => handleClose(true)} color="primary">
                        はい
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}