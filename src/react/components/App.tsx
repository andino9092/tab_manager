



export default function App(){

    const sendMsg = async() => {
        const [activeTab] = await chrome.tabs.query({active: true, lastFocusedWindow: true})
    
        await chrome.tabs.sendMessage(activeTab.id || 0, {
            greeting: 'hello'
        })
        .catch(
            (error) => console.log(error)
        )
        console.log(activeTab)
    }

    return (
        <div>
            <button onClick={sendMsg}>
                Click me
            </button>
            Hello
        </div>
    )
}