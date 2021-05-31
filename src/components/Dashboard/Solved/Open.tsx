import {Chip} from "@material-ui/core";
import React from "react";


export function Solved(props: { solved: boolean }): any {
    const {solved} = props;
    if (solved) {
        return (
            <Chip
                size="small"
                color="primary"
                label="解決済"
            />
        );
    } else {
        return (
            <Chip
                size="small"
                color="secondary"
                label="未解決"
            />
        );
    }
}

