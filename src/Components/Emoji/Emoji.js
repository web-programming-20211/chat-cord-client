import EmojiEmotionsOutlinedIcon from '@material-ui/icons/EmojiEmotionsOutlined';
import { useState } from 'react'

const Emoji = ({ dialog, react, self }) => {
    const [enter, setEnter] = useState(false)
    const [show, setShow] = useState(false)

    const style = {
        emoji: {
            background: enter ? '#999999' : 'none',
            borderRadius: '50%',
            padding: '1px',
            cursor: 'pointer',
            transition: 'background 300ms ease-out',
        },

        emojiList: {  
            display: 'flex',
            position: 'absolute',
            top: -16,
            right: self ? 2 : 'none',
            flexDirection: self ? 'row-reverse' : 'row',
        },

        allEmoji: { 
            position: 'relative',   
        }
    }

    const setEmoji = () => {
        if (show)
            setShow(false)
        else
            setShow(true)
    }

    const reaction = (reactionId) => {
        react(reactionId, dialog._id)
    }

    return (
        <div  style={style.allEmoji} onMouseLeave={() => setShow(false)}>
            {
                show && <div style={style.emojiList}>
                    <div style={{fontSize: '15px', cursor:'pointer'}} onClick={() => reaction(1)}>❤️</div>
                    <div style={{fontSize: '15px', cursor:'pointer'}} onClick={() => reaction(2)}>😂</div>
                    <div style={{fontSize: '15px', cursor:'pointer'}} onClick={() => reaction(3)}>😮</div>
                    <div style={{fontSize: '15px', cursor:'pointer'}} onClick={() => reaction(4)}>😢</div>
                    <div style={{fontSize: '15px', cursor:'pointer'}} onClick={() => reaction(5)}>😠</div>
                    <div style={{fontSize: '15px', cursor:'pointer'}} onClick={() => reaction(6)}>👍</div>
                </div>
            }
            <EmojiEmotionsOutlinedIcon
                style={style.emoji}
                onMouseEnter={() => setEnter(true)}
                onMouseLeave={() => setEnter(false)}
                onClick={() => setEmoji()}
            ></EmojiEmotionsOutlinedIcon>
        </div>
    )
}

export default Emoji