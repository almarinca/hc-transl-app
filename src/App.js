import { Header } from './Header';
import SpeechTranslator from './SpeechTranslator'
import ColdStartAlert from './ColdStartAlert';

function App() {
  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      <Header />
      <SpeechTranslator />
      <ColdStartAlert />
    </div>
  );
}

export default App;
