import {Chip} from "@mui/material";
import React from "react";


export function Open(props: { open: boolean }): any {
    const {open} = props;
    if (open) {
        return (
            <Chip
                size="small"
                color="primary"
                label="開通"
            />
        );
    } else {
        return (
            <Chip
                size="small"
                color="secondary"
                label="未開通"
            />
        );
    }
}


export function Enable(props: { open: boolean }): any {
    const {open} = props;
    if (open) {
        return (
            <Chip
                size="small"
                color="primary"
                label="有効"
            />
        );
    } else {
        return (
            <Chip
                size="small"
                color="secondary"
                label="無効"
            />
        );
    }
}

