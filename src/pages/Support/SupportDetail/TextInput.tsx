import React, { Dispatch, SetStateAction } from 'react'
import Button from '@mui/material/Button'
import { StyledWrapForm, StyledWrapText } from '../styles'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import remarkGfm from 'remark-gfm'

export const TextInput = (props: {
  inputChat: string
  setInputChat: Dispatch<SetStateAction<string>>
  setSendPush: Dispatch<SetStateAction<boolean>>
}) => {
  const { inputChat, setInputChat, setSendPush } = props

  // 送信内容確認ダイアログ
  const [openDialog, setOpenDialog] = React.useState(false)
  const handleClickSend = () => {
    setSendPush(true)
    setOpenDialog(false)
  }

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
            '& .MuiOutlinedInput-root': {
              '& > fieldset': { borderColor: 'black' },
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
            border: '3px solid #000000',
            borderRadius: '10px',
          }}
          onClick={() => setOpenDialog(true)}
        >
          <Typography
            variant="inherit"
            style={{
              writingMode: 'vertical-rl',
              letterSpacing: '0.3em',
            }}
          >
            内容確認
          </Typography>
        </Button>

        {/*送信内容確認ダイアログ*/}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          scroll="paper"
        >
          <DialogTitle>送信内容確認</DialogTitle>
          <Divider color="gray" />
          <DialogContent>
            <DialogContentText color="white">
              <ReactMarkdown skipHtml={true} remarkPlugins={[remarkGfm]}>
                {inputChat}
              </ReactMarkdown>
            </DialogContentText>
          </DialogContent>
          <Divider color="gray" />
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
            {/*内容が空の場合は送信ボタンをdisabledにする*/}
            {inputChat === '' ? (
              <Button disabled>送信</Button>
            ) : (
              <Button color="secondary" onClick={() => handleClickSend()}>
                送信
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </StyledWrapForm>
    </>
  )
}
