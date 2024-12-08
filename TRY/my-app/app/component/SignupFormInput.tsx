interface SignupFormInputInterface {
    placeholder: string
    type: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    value?: string
}

export function SignupFormInput({placeholder, type, onChange, value}: SignupFormInputInterface) {
    return (
        <input placeholder={placeholder} type={type} className="bg-red-50 py-2 w-full px-2 rounded-lg text-black focus:border-none outline-none md:py-4 px-2 shadow-md focus:shadow-lg" onChange={onChange} value={value}/>
    )
}

interface RegisterButtonInterface {
    buttonText: string
    onClick?: () => void
}

export function RegisterButton({buttonText, onClick}: RegisterButtonInterface) {
    return (
        <button  className="py-3 bg-red-600 mx-auto w-full font-bold text-2xl rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out hover:bg-red-700" onClick={onClick}>
            {buttonText}
        </button>
    )
}
