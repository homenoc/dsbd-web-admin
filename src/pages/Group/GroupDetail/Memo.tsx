import {GroupDetailData} from "../../../interface";
import useStyles from "./styles";
import {Button, Card, CardContent, Chip} from "@material-ui/core";
import React, {Dispatch, SetStateAction} from "react";

export function GroupMemo(props: { data: GroupDetailData, reload: Dispatch<SetStateAction<boolean>> }): any {
    const classes = useStyles();
    const {data} = props;

    const handleDelete = () => {
        console.info('You clicked the delete icon.');
    };

    const handleClick = () => {
        console.info('You clicked the Chip.');
    };

    return (
        <Card className={classes.root}>
            <CardContent>
                <h3>Memo<b>(未実装)</b></h3>
                <div className={classes.memo}>
                    <Chip
                        label="Memo1"
                        clickable
                        color="primary"
                        onDelete={handleDelete}
                    />
                    <Chip
                        label="Memo2"
                        clickable
                        color="primary"
                        onDelete={handleDelete}
                    />
                    <Chip label="Memo3" onDelete={handleDelete} color="primary"/>
                    <Chip
                        label="Memo4Memo"
                        onDelete={handleDelete}
                        color="secondary"
                    />
                </div>
                <Button
                    className={classes.button1}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    color={"primary"}
                    variant="outlined"
                    disabled={true}
                >
                    Memoの追加
                </Button>
            </CardContent>
        </Card>
    );
}
