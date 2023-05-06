import React, { Dispatch, SetStateAction } from 'react'
import SendIcon from '@mui/icons-material/Send'
import Button from '@mui/material/Button'
import { StyledWrapForm, StyledWrapText } from '../../../style'

export const TextInput = (props: {
  inputChat: string
  setInputChat: Dispatch<SetStateAction<string>>
  setSendPush: Dispatch<SetStateAction<boolean>>
}) => {
  const { inputChat, setInputChat, setSendPush } = props

  return (
    <>
      <StyledWrapForm noValidate autoComplete="off">
        <StyledWrapText
          id="standard-text"
          label="メッセージを入力"
          value={inputChat}
          //margin="normal"
          multiline
          rows={5}
          // TextFieldの枠線の色を変更
          // 無理やり変更する方法しかないみたいなので、したみたいな実装になっている
          sx={{
            "& .MuiOutlinedInput-root": {
              "& > fieldset": { borderColor: "black" },
            },
          }}
          onChange={(event) => {
            setInputChat(event.target.value)
          }}
        />
        <Button
          variant="contained"
          color="primary"
          style={{
            border: "3px solid #000000",
            borderRadius: "10px",
          }}
          onClick={() => setSendPush(true)}
        >
          <SendIcon />
        </Button>
      </StyledWrapForm>
    </>
  )
}
