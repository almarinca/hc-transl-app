import './Header.css'
import HelpButton from './HelpButton'
import './index'

function Header() {
    return (
        <header className="header bg-gray-800 text-white">
            <div className="logo-title">
                <div className="logo">🪄</div>
                <h1 className="title">Live Speech Translator</h1>
            </div>
            <HelpButton />
        </header>
    )
}

export {Header}
