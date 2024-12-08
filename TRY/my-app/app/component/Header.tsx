import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-row sticky z-50 top-0 justify-between items-center py-4 px-6 font-medium text-lg mb-8 bg-white border border-b-3">
            <div className="flex justify-center align-center gap-3">
                <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.8438 21.5C22.8438 23.2819 23.5516 24.9909 24.8116 26.2509C26.0716 27.5109 27.7806 28.2188 29.5625 28.2188H29.6163C30.9314 28.2691 31.9678 27.9735 33.1839 27.1925C33.4885 26.9988 33.8394 26.8904 34.2002 26.8787C34.5609 26.8669 34.9182 26.9523 35.2346 27.1258C35.5511 27.2993 35.8152 27.5546 35.9993 27.8651C36.1834 28.1755 36.2808 28.5297 36.2812 28.8906V34.9375C36.2812 35.6503 35.9981 36.3338 35.4941 36.8378C34.9901 37.3419 34.3065 37.625 33.5938 37.625H9.40625C8.69348 37.625 8.0099 37.3419 7.5059 36.8378C7.0019 36.3338 6.71875 35.6503 6.71875 34.9375V8.0625C6.71875 7.34973 7.0019 6.66615 7.5059 6.16215C8.0099 5.65815 8.69348 5.375 9.40625 5.375H33.5938C34.3065 5.375 34.9901 5.65815 35.4941 6.16215C35.9981 6.66615 36.2812 7.34973 36.2812 8.0625V14.1094C36.2811 14.4709 36.1836 14.8258 35.9991 15.1367C35.8146 15.4477 35.5499 15.7033 35.2327 15.8768C34.9155 16.0503 34.5574 16.1352 34.1961 16.1227C33.8347 16.1102 33.4834 16.0008 33.1789 15.8059C32.1587 15.1691 30.987 14.8162 29.7848 14.7835C28.5826 14.7507 27.3935 15.0395 26.3402 15.6198C25.2869 16.2001 24.4075 17.051 23.7929 18.0847C23.1782 19.1184 22.8506 20.2974 22.8438 21.5Z" fill="#E32D2D"/>
                </svg>
                <div className="text-sm md:text-2xl"> Eth Funding</div>
            </div>
            <div className="flex gap-2">
                <button 
                    className="mx-6 border-b-4 border-white hover:border-red-600 transition-colors duration-300"
                    onClick={() => {navigate("/signin")}}>
                        Home
                    </button>
                <button 
                    className="mx-6 border-b-4 border-white hover:border-red-600 transition-colors duration-300"
                    onClick={() => {navigate("/signin")}}
                >Sign in</button>
                {/* <button className="flex items-center gap-2 bg-orange-300 mx-6 hover:bg-orange-600 text-white font-medium py-2 px-2 rounded shadow-lg transition duration-200 text-sm">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 507.83 470.86"
                        className="w-5 h-5 fill-current"
                    >
                        <defs>
                        <style>
                            {`.a{fill:#e2761b;stroke:#e2761b;}
                            .a,.b,.c,.d,.e,.f,.g,.h,.i,.j{stroke-linecap:round;stroke-linejoin:round;}
                            .b{fill:#e4761b;stroke:#e4761b;}
                            .c{fill:#d7c1b3;stroke:#d7c1b3;}
                            .d{fill:#233447;stroke:#233447;}
                            .e{fill:#cd6116;stroke:#cd6116;}
                            .f{fill:#e4751f;stroke:#e4751f;}
                            .g{fill:#f6851b;stroke:#f6851b;}
                            .h{fill:#c0ad9e;stroke:#c0ad9e;}
                            .i{fill:#161616;stroke:#161616;}
                            .j{fill:#763d16;stroke:#763d16;}`}
                        </style>
                        </defs>
                        <title>metamask</title>
                        <polygon className="a" points="482.09 0.5 284.32 147.38 320.9 60.72 482.09 0.5" />
                        <polygon className="b" points="25.54 0.5 221.72 148.77 186.93 60.72 25.54 0.5" />
                        <polygon className="b" points="410.93 340.97 358.26 421.67 470.96 452.67 503.36 342.76 410.93 340.97" />
                        <polygon className="b" points="4.67 342.76 36.87 452.67 149.57 421.67 96.9 340.97 4.67 342.76" />
                        <polygon className="b" points="143.21 204.62 111.8 252.13 223.7 257.1 219.73 136.85 143.21 204.62" />
                        <polygon className="b" points="364.42 204.62 286.91 135.46 284.32 257.1 396.03 252.13 364.42 204.62" />
                        <polygon className="b" points="149.57 421.67 216.75 388.87 158.71 343.55 149.57 421.67" />
                        <polygon className="b" points="290.88 388.87 358.26 421.67 348.92 343.55 290.88 388.87" />
                        <polygon className="c" points="358.26 421.67 290.88 388.87 296.25 432.8 295.65 451.28 358.26 421.67" />
                        <polygon className="c" points="149.57 421.67 212.18 451.28 211.78 432.8 216.75 388.87 149.57 421.67" />
                        <polygon className="d" points="213.17 314.54 157.12 298.04 196.67 279.95 213.17 314.54" />
                        <polygon className="d" points="294.46 314.54 310.96 279.95 350.71 298.04 294.46 314.54" />
                        <polygon className="e" points="149.57 421.67 159.11 340.97 96.9 342.76 149.57 421.67" />
                        <polygon className="e" points="348.72 340.97 358.26 421.67 410.93 342.76 348.72 340.97" />
                        <polygon className="e" points="396.03 252.13 284.32 257.1 294.66 314.54 311.16 279.95 350.91 298.04 396.03 252.13" />
                        <polygon className="e" points="157.12 298.04 196.87 279.95 213.17 314.54 223.7 257.1 111.8 252.13 157.12 298.04" />
                        <polygon className="f" points="111.8 252.13 158.71 343.55 157.12 298.04 111.8 252.13" />
                        <polygon className="f" points="350.91 298.04 348.92 343.55 396.03 252.13 350.91 298.04" />
                        <polygon className="f" points="223.7 257.1 213.17 314.54 226.29 382.31 229.27 293.07 223.7 257.1" />
                        <polygon className="f" points="284.32 257.1 278.96 292.87 281.34 382.31 294.66 314.54 284.32 257.1" />
                        <polygon className="g" points="294.66 314.54 281.34 382.31 290.88 388.87 348.92 343.55 350.91 298.04 294.66 314.54" />
                        <polygon className="g" points="157.12 298.04 158.71 343.55 216.75 388.87 226.29 382.31 213.17 314.54 157.12 298.04" />
                        <polygon className="h" points="295.65 451.28 296.25 432.8 291.28 428.42 216.35 428.42 211.78 432.8 212.18 451.28 149.57 421.67 171.43 439.55 215.75 470.36 291.88 470.36 336.4 439.55 358.26 421.67 295.65 451.28" />
                        <polygon className="i" points="290.88 388.87 281.34 382.31 226.29 382.31 216.75 388.87 211.78 432.8 216.35 428.42 291.28 428.42 296.25 432.8 290.88 388.87" />
                        <polygon className="j" points="490.44 156.92 507.33 75.83 482.09 0.5 290.88 142.41 364.42 204.62 468.37 235.03 491.43 208.2 481.49 201.05 497.39 186.54 485.07 177 500.97 164.87 490.44 156.92" />
                        <polygon className="j" points="0.5 75.83 17.39 156.92 6.66 164.87 22.56 177 10.44 186.54 26.34 201.05 16.4 208.2 39.26 235.03 143.21 204.62 216.75 142.41 25.54 0.5 0.5 75.83" />
                        <polygon className="g" points="468.37 235.03 364.42 204.62 396.03 252.13 348.92 343.55 410.93 342.76 503.36 342.76 468.37 235.03" />
                        <polygon className="g" points="143.21 204.62 39.26 235.03 4.67 342.76 96.9 342.76 158.71 343.55 111.8 252.13 143.21 204.62" />
                        <polygon className="g" points="284.32 257.1 290.88 142.41 321.1 60.72 186.93 60.72 221.92 142.41 223.7 257.1 226.29 293.07 281.34 292.87 284.32 257.1" />
                    </svg>
                    Connect Wallet
                </button> */}
                <button 
                    className="bg-red-400 text-sm text-white rounded-3xl mx-6 px-8 py-3 hover:bg-red-600"
                    onClick={() => {navigate("/register")}}
                >Register</button>
            </div>
        </div>
    )
}

export default Header;