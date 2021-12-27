const Guide = () => {
    const styles = {
        guide: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '95%',
            fontSize: '1.5em',
            backgroundColor: 'rgb(227, 246, 252)',
            margin: 'auto 20px',
            borderRadius: '14px',
        },
    }
    return (
        <div style={styles.guide}>
            <h1>pick a room to start <br></br> or create a new room</h1> 
        </div>
    )
}

export default Guide;