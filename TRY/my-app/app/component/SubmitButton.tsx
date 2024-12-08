interface SubmitButtonInterface {
    onClick?: () => void
}

function SubmitButton({onClick}: SubmitButtonInterface) {
    return (
        <button onClick={onClick} className="text-white bg-orange-500 mt-2 py-3 px-2 rounded-lg hover:border border-orange-400 hover:shadow-lg hover:shadow-orange-400 transition-shadow duration-300 font-semibold md:font-medium text-lg">
            Submit
        </button>

    )
}

export default SubmitButton;