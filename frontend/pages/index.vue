<template>
    <div class="bg-neutral flex flex-col items-center justify-center w-screen h-screen">
        <img src="~assets/logo-01.png" alt="Logo" class="w-52 h-52" />
        <h1 class="text-primary text-2xl my-1">DarkWorlds</h1>

        <form v-if="(authStatus == 'login')" @submit.prevent="login"
            class="bg-black p-2 rounded flex flex-col items-stretch justify-center">
            <p class=" text-primary text-xl m-2 p-1 text-center">Login</p>
            <input required v-model="username" class="input max-w-xs mt-2" placeholder="Username" />
            <input required v-model="password" minlength="8" type="password" class="input max-w-xs mt-2"
                placeholder="Password" />
            <button type="submit" class="btn mt-2">Play</button>
            <p class="text text-primary text-xs mt-2">New to game? <button @click="authStatus = 'register'"
                    class="btn btn-xs ml-1">Register</button></p>
        </form>
        <form v-if="(authStatus == 'register')" @submit.prevent="register"
            class="bg-black p-2 rounded flex flex-col items-stretch justify-center">
            <p class=" text-primary text-xl m-2 p-1 text-center">Make account</p>
            <input required v-model="username" class="input max-w-xs mt-2" placeholder="Username" />
            <input required v-model="password" minlength="8" type="password" class="input max-w-xs mt-2"
                placeholder="Password" />
            <input required v-model="passwordConfirm" minlength="8" type="password" class="input max-w-xs mt-2"
                placeholder="Repeat password" />
            <button type="submit" class="btn mt-2">Play</button>
            <p class="text text-primary text-xs mt-2">Already played? <button @click="authStatus = 'login'"
                    class="btn btn-xs ml-1">Log in</button></p>
        </form>
        <div class="flex flex-col w-1/2 items-center justify-center">
            <p v-for="message in messages" class="flex flex-row justify-center text-center w-full p-2"
                :style="{ color: message.color }">{{
                        message.from
                }}: {{ message.text }}</p>
        </div>
    </div>
</template>
<script setup>
let server = "ws://localhost:8080"
const socket = new WebSocket(server);
let loggedIn = ref(false);
let authStatus = ref("login")
let password = ref("")
let passwordConfirm = ref("")
let messages = ref([])
let username = ref("")
async function login() {
    socket.send(JSON.stringify({ method: "login", username: username.value, passwordDoubleHash: await hash(await hash(password.value)) }))
}
async function register() {
    if (password.value != passwordConfirm.value) {
        return messages.value.push({ from: "[SYSTEM]", color: "red", text: "Passwords do not match!" })
    }
    socket.send(JSON.stringify({ method: "register", username: username.value, passwordHash: await hash(password.value) }))

}

async function hash(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
    return hashHex;
}
async function gotMessage(message) {
    message.internalId = (Math.round(Math.random() * 1000000) + Date.now()).toString(16)
    if (!loggedIn.value) {
        ({
            chat: () => {
                let ind = messages.value.push(message)
                setTimeout(() => {

                    messages.value = messages.value.filter(m => m.internalId != message.internalId)
                }, 10000)
            }
        })[message.method](message)
    }

}

socket.addEventListener("message", (ev) => {
    let msg = JSON.parse(ev.data.toString())
    gotMessage(msg)
})
</script>