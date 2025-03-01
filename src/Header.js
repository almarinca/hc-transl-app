import './Header.css'
import HelpButton from './HelpButton'
import './index'

function Header() {
    return (
        <header className="header bg-gray-800 text-white">
            <div class="logo-title">
                <div class="logo">🪄</div>
                <h1 class="title">Live Speech Translator</h1>
            </div>
            <HelpButton />
        </header>
    )
}

export {Header}
