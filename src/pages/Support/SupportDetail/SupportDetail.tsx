import React, {useEffect, useRef, useState} from "react";
import {DefaultChatDataArray} from "../../../interface";
import {StyledDivContainer, StyledPaper, StyledPaperMessageBody} from "./styles";
import {restfulApiConfig} from "../../../api/Config";
import useWebSocket from "react-use-websocket";
import {MessageLeft, MessageRight} from "./Message";
import {TextInput} from "./TextInput";
import {Get} from "../../../api/Support";
import {useSnackbar} from "notistack";
import {useParams} from "react-router-dom";

export default function SupportDetail() {
    let id: string | undefined;
    ({id} = useParams());
    const {sendMessage, lastMessage} = useWebSocket(restfulApiConfig.wsURL + "/support" +
        '?id=' + id + '&user_token=' + sessionStorage.getItem('ClientID') + '&access_token=' +
        sessionStorage.getItem('AccessToken'), {
        onOpen: () => enqueueSnackbar("WebSocket接続確立", {variant: "success"}),
        onClose: () => enqueueSnackbar("WebSocket切断", {variant: "error"}),
        shouldReconnect: (closeEvent) => true,
    });
    const {enqueueSnackbar} = useSnackbar();
    const [baseChatData, setBaseChatData] = useState(DefaultChatDataArray);
    const [inputChatData, setInputChatData] = useState("");
    const [sendPush, setSendPush] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setBaseChatData([]);
        console.log(id);
        Get(Number(id)).then(res => {
            if (res.error === "") {
                console.log(res.data);
                setBaseChatData([]);
                const tmpChat = []

                for (const tmp of res.data.chat) {
                    let userName = "管理者";
                    if (!tmp.admin) {
                        userName = tmp.user.name;
                    }
                    tmpChat.push({admin: tmp.admin, data: tmp.data, time: tmp.CreatedAt, user_name: userName})
                }
                setBaseChatData(tmpChat);
                console.log(baseChatData);
                ref.current?.scrollIntoView()
            } else {
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        })
    }, []);

    useEffect(() => {
        console.log(lastMessage)
        if (lastMessage !== null) {
            console.log(lastMessage?.data)
            const obj = JSON.parse(lastMessage?.data);
            console.log(obj)
            setBaseChatData(tmpChat => [...tmpChat, {
                admin: obj.admin,
                data: obj.message,
                time: obj.time,
                user_name: obj.username
            }]);
            if (obj.admin) {
                enqueueSnackbar("送信しました。", {variant: "success"})
            } else {
                enqueueSnackbar("新規メッセージがあります", {variant: "success"})
            }
            ref.current?.scrollIntoView()
        }
    }, [lastMessage]);

    useEffect(() => {
        if (sendPush) {
            sendMessage(JSON.stringify({
                ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
                message: inputChatData
            }));
            setSendPush(false);
        }
    }, [sendPush]);

    return (
        <StyledDivContainer>
            <StyledPaper>
                <StyledPaperMessageBody id="style-1">
                    <b>このチャットはMarkdownに準拠しております。</b>
                    {
                        baseChatData.map((chat, index) =>
                            chat.admin ?
                                <MessageRight key={index} message={chat.data} timestamp={chat.time}/>
                                :
                                <MessageLeft key={index} message={chat.data} timestamp={chat.time}
                                             displayName={chat.user_name}/>
                        )
                    }
                    <div ref={ref}/>
                </StyledPaperMessageBody>
                <TextInput key={"textInput"} inputChat={inputChatData} setInputChat={setInputChatData}
                           setSendPush={setSendPush}/>
            </StyledPaper>
        </StyledDivContainer>
    );
}
