const EmojiIcon = ({emojiIndex}) => {
    const style = {
        marginRight: '2px',
        cursor: 'pointer',
        fontSize: 'small'
    }
    const GetEmoji = () => {
        switch (emojiIndex)
        {
            case 1:
                return <div style={style}>❤️</div>
            case 2:
                return <div style={style}>😂</div>
            case 3:
                return <div style={style}>😮</div>
            case 4:
                return <div style={style}>😢</div>
            case 5:
                return <div style={style}>😠</div>
            case 6:
                return <div style={style}>👍</div>
            default:
                return 
        }
    }
    return (
        <GetEmoji></GetEmoji>
    )
}

export default EmojiIcon