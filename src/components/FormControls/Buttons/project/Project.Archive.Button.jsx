import { Button } from "@mui/material";
import React from "react";
import { useMutation } from "react-query";
export const ArchiveProjectButton = ({test})=>{
    test()
    return (
        <Button onClick={(e)=>{
            e.stopPropagation();
            e.preventDefault()
            test()
        }}>archive</Button>
    )
}