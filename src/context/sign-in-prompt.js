import React from 'react'
import SignInPrompt from '../components/signInPrompt'

let SignInPromptContext
let { Provider } = (SignInPromptContext = React.createContext())


function SignInPromptContextProvider(props) {

	const [showPrompt, setShowPrompt] = React.useState(false);

	return (
		<Provider value={{
			showPrompt: showPrompt,
			setShowPrompt: setShowPrompt
		}} >
          {showPrompt && <SignInPrompt/>}	
		  {props.children}
		</Provider>
	)


}

export { SignInPromptContext, SignInPromptContextProvider }
