/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [],
    theme: {
        extend: {

            fontFamily: {
                'sans': ['Inter'],
            },
        },
    },
    plugins: [require("daisyui")],
}
